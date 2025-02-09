import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { AddToCalendar } from '@/components/ui/add-to-calendar-wrapper';
import { EventListItem } from '@/components/event-list-item';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default async function MyEventsPage() {
    const supabase = await createClient();

    // Check authentication
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
        redirect('/sign-in');
    }

    // Getting user's bookings with related event data
    const { data: bookings, error } = await supabase
        .from('bookings')
        .select(
            `
            *,
            event:events (
                *,
                locations (*),
                event_types (*),
                organiser_profiles (*)
            )
        `
        )
        .eq('user_id', user.id)
        .eq('status', 'confirmed')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching bookings:', error);
        return <div>Failed to load events</div>;
    }

    // Getting upcoming and past events
    const now = new Date().toISOString();
    const upcomingEvents =
        bookings?.filter((booking) => booking.event.starts_at > now) || [];
    const pastEvents =
        bookings?.filter((booking) => booking.event.starts_at <= now) || [];

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col gap-8">
                    {/* Header Section */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl font-bold">My Events</h1>
                        </div>

                        {/* Filter Tabs */}
                        <Tabs defaultValue="upcoming" className="w-full">
                            <TabsList>
                                <TabsTrigger value="upcoming">
                                    Upcoming Events
                                </TabsTrigger>
                                <TabsTrigger value="past">
                                    Past Events
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    {/* Events List */}
                    <div className="space-y-6">
                        {bookings?.length === 0 ? (
                            <EmptyState />
                        ) : (
                            bookings?.map((booking) => (
                                <EventListItem
                                    key={booking.id}
                                    event={booking.event}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Ticket className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">No Events Found</h3>
                <p className="text-muted-foreground mb-4 max-w-sm">
                    You haven't booked any events yet. Browse our events and
                    find something you'll love!
                </p>
                <Link href="/" className="text-primary hover:underline">
                    Browse Events
                </Link>
            </CardContent>
        </Card>
    );
}
