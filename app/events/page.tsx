import { createClient } from '@/utils/supabase/server';
import { EventCard } from '@/components/event-card';
import { Suspense } from 'react';

export default async function EventsPage() {
    const supabase = await createClient();

    const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

    if (error) {
        console.error('Error fetching events:', error);
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-destructive">
                    Failed to load events. Please try again later.
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Upcoming Events</h1>
            <Suspense fallback={<EventsLoadingSkeleton />}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events?.length ? (
                        events.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))
                    ) : (
                        <p className="text-muted-foreground col-span-full text-center py-12">
                            No events found. Check back later or create your
                            own!
                        </p>
                    )}
                </div>
            </Suspense>
        </div>
    );
}

function EventsLoadingSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-lg border p-6 animate-pulse">
                    <div className="aspect-video w-full mb-4 bg-muted rounded-md" />
                    <div className="h-6 bg-muted rounded w-3/4 mb-4" />
                    <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-full" />
                        <div className="h-4 bg-muted rounded w-5/6" />
                    </div>
                </div>
            ))}
        </div>
    );
}
