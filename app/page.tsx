import { createClient } from '@/utils/supabase/server';
import { EventCard } from '@/components/event-card';
import { EventsFilter } from '@/components/events-filter';
import { Suspense } from 'react';
import { EventsLoadingSkeleton } from '@/components/events-loading-skeleton';
import { InfiniteScroll } from '@/components/infinite-scroll';

const ITEMS_PER_PAGE = 12;

export default async function Home({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) {
    // Converts searchParams to a Promise and await it
    const params = await Promise.resolve(searchParams);

    const sort = params.sort || 'starts_at';
    const search = params.search || '';
    const type = params.type || '';
    const page = Number(params.page) || 1;

    const supabase = await createClient();

    let query = supabase
        .from('events')
        .select(
            `
            *,
            event_types(name),
            locations(name, city),
            organiser_profiles(name)
        `
        )
        .eq('is_published', true)
        .order('starts_at', { ascending: sort !== 'latest' });

    if (search) {
        query = query.ilike('title', `%${search}%`);
    }
    if (type) {
        query = query.eq('type_id', type);
    }

    query = query.range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

    const { data: events, error, count } = await query;

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

    const hasMore = Boolean(count && events.length < count);

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 container mx-auto px-4 py-8">
                <section className="space-y-8">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                            Find local events near you
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Discover and join events in your community, or
                            create your own.
                        </p>
                    </div>

                    <EventsFilter />

                    <Suspense fallback={<EventsLoadingSkeleton />}>
                        <InfiniteScroll
                            hasMore={hasMore}
                            currentPage={page}
                            itemCount={events?.length ?? 0}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {events?.length ? (
                                    events.map((event) => (
                                        <EventCard
                                            key={event.id}
                                            event={event}
                                        />
                                    ))
                                ) : (
                                    <p className="text-muted-foreground col-span-full text-center py-12">
                                        No events found. Try adjusting your
                                        filters.
                                    </p>
                                )}
                            </div>
                        </InfiniteScroll>
                    </Suspense>
                </section>
            </main>
        </div>
    );
}
