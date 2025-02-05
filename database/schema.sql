-- Create the extensions schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS extensions;

-- UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA extensions;

-- use profile table for more user features such as avatar and username, auth will handle email, password and UID
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

-- Enable RLS on all tables
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organiser_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_types ENABLE ROW LEVEL SECURITY;

-- policies for events (public viewing, authenticated users can create)
CREATE POLICY "Events are viewable by everyone"
    ON public.events FOR SELECT
    USING (true);

CREATE POLICY "Events can be managed by organiser"
    ON public.events
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.organiser_profiles
            WHERE id = organiser_profile_id 
            AND user_id = auth.uid()
        )
    );

-- policies for locations (anyone can view, authenticated users can manage)
CREATE POLICY "Locations are viewable by everyone"
    ON public.locations FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can manage locations"
    ON public.locations
    FOR ALL
    USING (auth.role() = 'authenticated');

-- policies for profiles and organiser profiles
CREATE POLICY "Profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can manage their own profile"
    ON public.profiles
    FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own organiser profile"
    ON public.organiser_profiles 
    FOR ALL
    USING (auth.uid() = user_id);

-- policies for event_types
CREATE POLICY "Event types are viewable by everyone"
    ON public.event_types FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Event types can be modified by authenticated users" ON public.event_types;

CREATE POLICY "Event types can be inserted by authenticated users" 
    ON public.event_types 
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Event types can be updated by authenticated users" 
    ON public.event_types 
    FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Event types can be deleted by authenticated users" 
    ON public.event_types 
    FOR DELETE
    USING (auth.role() = 'authenticated');

-- tickets policies
DROP POLICY IF EXISTS "Users can view their own tickets" ON public.tickets;
DROP POLICY IF EXISTS "Users can only create tickets through bookings" ON public.tickets;

CREATE POLICY "Users can view their own tickets"
    ON public.tickets FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Event organisers can view tickets for their events"
    ON public.tickets FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.events e
            JOIN public.organiser_profiles op ON e.organiser_profile_id = op.id
            WHERE e.id = tickets.event_id
            AND op.user_id = auth.uid()
        )
    );

CREATE POLICY "Tickets can be created through bookings"
    ON public.tickets FOR INSERT
    WITH CHECK (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM public.bookings
            WHERE bookings.id = booking_id
            AND bookings.user_id = auth.uid()
        )
    );

CREATE POLICY "Event organisers can update ticket status"
    ON public.tickets FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.events e
            JOIN public.organiser_profiles op ON e.organiser_profile_id = op.id
            WHERE e.id = tickets.event_id
            AND op.user_id = auth.uid()
        )
    );

-- event ratings policies:
DROP POLICY IF EXISTS "Users can rate events they've booked" ON public.event_ratings;
DROP POLICY IF EXISTS "Users can view all event ratings" ON public.event_ratings;

CREATE POLICY "Event ratings are viewable by everyone"
    ON public.event_ratings FOR SELECT
    USING (true);

CREATE POLICY "Users can create ratings for events they've booked"
    ON public.event_ratings FOR INSERT
    WITH CHECK (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM public.bookings
            WHERE bookings.event_id = event_ratings.event_id
            AND bookings.user_id = auth.uid()
            AND bookings.status = 'confirmed'
        )
    );

CREATE POLICY "Users can update their own ratings"
    ON public.event_ratings FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ratings"
    ON public.event_ratings FOR DELETE
    USING (auth.uid() = user_id);

-- Booking Policies
create policy "Users can create their own bookings"
    on public.bookings for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy "Users can view their own bookings"
    on public.bookings for select
    to authenticated
    using (auth.uid() = user_id);

-- Payment Related Policies
create policy "Users can update their own pending bookings"
    on public.bookings
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id AND status = 'pending')
    WITH CHECK (auth.uid() = user_id);

create policy "Users can view their own payment intents"
    on public.bookings
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id AND payment_intent_id IS NOT NULL);

-- Allowing updating max_attendees for confirmed bookings
create policy "Update max_attendees on booking confirmation"
    on public.events for update
    to authenticated
    using (true)
    with check (
        exists (
            select 1 from public.bookings
            where bookings.event_id = events.id
            and bookings.status in ('confirmed', 'pending')
        )
    );    

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

-- Function to handle new user creation and set up profiles and organiser profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Inserts into profiles table
  INSERT INTO public.profiles (user_id, username, created_at, updated_at)
  VALUES (
    NEW.id,
    split_part(NEW.email, '@', 1),  -- Gets the part before @ in email
    NOW(),
    NOW()
  );

  -- Insert into organiser_profiles table
  INSERT INTO public.organiser_profiles (user_id, name, slug, created_at, updated_at)
  VALUES (
    NEW.id,
    split_part(NEW.email, '@', 1),  -- Gets the part before @ in email
    lower(replace(split_part(NEW.email, '@', 1), '.', '-')), -- Creates a URL-safe slug from email
    NOW(),
    NOW()
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete an event and related data
create or replace function delete_event(event_id uuid, user_id uuid)
returns void
language plpgsql
security definer
as $$
declare
    _event_exists boolean;
begin
    -- Check if the event belongs to the user's organiser profile
    select exists (
        select 1 
        from events e
        join organiser_profiles op on op.id = e.organiser_profile_id
        where e.id = delete_event.event_id 
        and op.user_id = delete_event.user_id
    ) into _event_exists;
    
    if not _event_exists then
        raise exception 'Unauthorized: Event not found or not owned by user';
    end if;

    -- Delete bookings first
    delete from bookings where event_id = delete_event.event_id;
    
    -- Delete tickets
    delete from tickets where event_id = delete_event.event_id;
    
    -- Finally delete the event
    delete from events where id = delete_event.event_id;
end;
$$;

-- Triggers the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger for profiles table to handle updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to cancel an event
create or replace function cancel_event(event_id uuid, user_id uuid)
returns void
language plpgsql
security definer
as $$
declare
    _event_exists boolean;
begin
    -- Check if the event belongs to the user's organiser profile
    select exists (
        select 1 
        from events e
        join organiser_profiles op on op.id = e.organiser_profile_id
        where e.id = cancel_event.event_id 
        and op.user_id = cancel_event.user_id
    ) into _event_exists;
    
    if not _event_exists then
        raise exception 'Unauthorized: Event not found or not owned by user';
    end if;

    -- Update the event to unpublish it
    update events 
    set 
        is_published = false,
        updated_at = TIMEZONE('utc'::text, NOW())
    where id = cancel_event.event_id;
end;
$$;

-- Function to update an event
create or replace function update_event(
    event_id uuid,
    user_id uuid,
    title text,
    short_description text,
    full_description text,
    image_url text,
    type_id uuid,
    location_id uuid,
    max_attendees integer,
    ticket_price decimal,
    starts_at timestamp with time zone,
    ends_at timestamp with time zone
)
returns void
language plpgsql
security definer
as $$
declare
    _event_exists boolean;
begin
    -- Check if the event belongs to the user's organiser profile
    select exists (
        select 1 
        from events e
        join organiser_profiles op on op.id = e.organiser_profile_id
        where e.id = update_event.event_id 
        and op.user_id = update_event.user_id
        and e.is_published = true
    ) into _event_exists;
    
    if not _event_exists then
        raise exception 'Unauthorized: Event not found, not owned by user, or cancelled';
    end if;

    -- Update the event
    update events 
    set 
        title = update_event.title,
        short_description = update_event.short_description,
        full_description = update_event.full_description,
        image_url = update_event.image_url,
        type_id = update_event.type_id,
        location_id = update_event.location_id,
        max_attendees = update_event.max_attendees,
        ticket_price = update_event.ticket_price,
        starts_at = update_event.starts_at,
        ends_at = update_event.ends_at,
        updated_at = TIMEZONE('utc'::text, NOW())
    where id = update_event.event_id;
end;
$$;

-- policy for organiser_profiles
CREATE POLICY "Organiser profiles are viewable by everyone"
    ON public.organiser_profiles FOR SELECT
    USING (true);


