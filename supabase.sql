-- Create the extensions schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS extensions;

-- UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA extensions;

-- auth schema for users (do not create this table, use the existing one)
-- use profile table for more user features such as avatar and username
CREATE TABLE public.profiles (
    id bigint primary key generated always as identity,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    username TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- index on the user_id for better performance on joins
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);

-- Function to handle updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- locations table
CREATE TABLE public.locations (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT,
    country TEXT NOT NULL,
    postal_code TEXT,
    venue_type TEXT,
    latitude NUMERIC(10,8),
    longitude NUMERIC(11,8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- event_types table
CREATE TABLE public.event_types (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- organiser_profiles table
CREATE TABLE public.organiser_profiles (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    profile_image_url TEXT,
    website_url TEXT,
    contact_email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT organiser_profiles_user_id_key UNIQUE (user_id)
);

-- events table
CREATE TABLE public.events (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    organiser_profile_id uuid REFERENCES public.organiser_profiles(id) ON DELETE CASCADE NOT NULL,
    location_id uuid REFERENCES public.locations(id) ON DELETE SET NULL,
    type_id uuid REFERENCES public.event_types(id) ON DELETE SET NULL,
    max_attendees INTEGER,
    starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_all_day BOOLEAN DEFAULT false,
    website_url TEXT,
    image_url TEXT,
    ticket_price DECIMAL(10,2),
    tags TEXT[] DEFAULT '{}',
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- bookings table
CREATE TABLE public.bookings (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id uuid REFERENCES public.events(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    payment_intent_id TEXT UNIQUE,
    ticket_quantity INTEGER NOT NULL CHECK (ticket_quantity > 0),
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- tickets table
CREATE TABLE public.tickets (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE,
    event_id uuid REFERENCES public.events(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    ticket_number TEXT UNIQUE NOT NULL,
    is_scanned BOOLEAN DEFAULT false,
    scanned_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- event_ratings table
CREATE TABLE public.event_ratings (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id uuid REFERENCES public.events(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(event_id, user_id)
);

-- updated_at triggers
CREATE TRIGGER update_locations_updated_at
    BEFORE UPDATE ON public.locations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organiser_profiles_updated_at
    BEFORE UPDATE ON public.organiser_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organiser_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Events policies
CREATE POLICY "Events are viewable by everyone"
    ON public.events FOR SELECT
    USING (
        is_published = true OR 
        EXISTS (
            SELECT 1 FROM public.organiser_profiles
            WHERE id = events.organiser_profile_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Events can be created by users with organiser profiles"
    ON public.events FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.organiser_profiles
            WHERE id = organiser_profile_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Events can be updated by organiser"
    ON public.events FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.organiser_profiles
            WHERE id = organiser_profile_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Events can be deleted by organiser"
    ON public.events FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.organiser_profiles
            WHERE id = organiser_profile_id 
            AND user_id = auth.uid()
        )
    );

-- Bookings policies
CREATE POLICY "Users can view their own bookings"
    ON public.bookings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
    ON public.bookings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Organiser profiles policies
CREATE POLICY "Organiser profiles are viewable by everyone"
    ON public.organiser_profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can create their own organiser profile"
    ON public.organiser_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own organiser profile"
    ON public.organiser_profiles FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own organiser profile"
    ON public.organiser_profiles FOR DELETE
    USING (auth.uid() = user_id);

-- policies for event_types
CREATE POLICY "Event types are viewable by everyone"
    ON public.event_types FOR SELECT
    USING (true);

-- policies for tickets
CREATE POLICY "Users can view their own tickets"
    ON public.tickets FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can only create tickets through bookings"
    ON public.tickets FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- policies for locations
CREATE POLICY "Locations are viewable by everyone"
    ON public.locations FOR SELECT
    USING (true);

-- event ratings policies:
CREATE POLICY "Users can rate events they've booked"
    ON public.event_ratings FOR INSERT
    WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM public.bookings
            WHERE bookings.event_id = event_ratings.event_id
            AND bookings.user_id = auth.uid()
            AND bookings.status = 'confirmed'
        )
    );

CREATE POLICY "Users can view all event ratings"
    ON public.event_ratings FOR SELECT
    USING (true);

-- events types policy:
CREATE POLICY "Event types can only be modified by authenticated users"
    ON public.event_types 
    FOR ALL 
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- Sample data (only keeping lookup tables data)
INSERT INTO public.event_types (name, description) VALUES
    ('Conference', 'Professional gathering for learning and networking'),
    ('Workshop', 'Hands-on learning experience'),
    ('Concert', 'Live music performance'),
    ('Exhibition', 'Display of art, products, or ideas'),
    ('Networking', 'Social gathering for professional connections');

INSERT INTO public.locations (name, address, city, state, country, postal_code, venue_type) VALUES
    ('Tech Hub', '123 Innovation Street', 'London', 'England', 'United Kingdom', 'EC1V 4PW', 'Conference Center'),
    ('Creative Space', '456 Art Avenue', 'Manchester', 'England', 'United Kingdom', 'M1 1AD', 'Gallery'),
    ('Music Hall', '789 Melody Lane', 'Birmingham', 'England', 'United Kingdom', 'B1 1BB', 'Concert Venue');

-- indexes 
CREATE INDEX idx_events_starts_at ON public.events(starts_at);
CREATE INDEX idx_events_is_published ON public.events(is_published);
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_event_id ON public.bookings(event_id);
CREATE INDEX idx_tickets_booking_id ON public.tickets(booking_id);
CREATE INDEX idx_organiser_profiles_user_id ON public.organiser_profiles(user_id);
CREATE INDEX idx_events_organiser_profile_id ON public.events(organiser_profile_id);
CREATE INDEX idx_events_slug ON public.events(slug);
CREATE INDEX idx_organiser_profiles_slug ON public.organiser_profiles(slug);