import { createClient } from '@/utils/supabase/server';
import { EventCard } from '@/components/event-card';
import { EventsFilter } from '@/components/events-filter';
import { Suspense } from 'react';
import { EventsLoadingSkeleton } from '@/components/events-loading-skeleton';
import { InfiniteScroll } from '@/components/infinite-scroll';

const ITEMS_PER_PAGE = 12;

type Props = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home(props: Props) {
    const searchParams = await props.searchParams;
    const sort = searchParams.sort?.toString() || 'starts_at';
    const search = searchParams.search?.toString() || '';
    const type = searchParams.type?.toString() || '';
    const page = Number(searchParams.page) || 1;

    const supabase = await createClient();

    const currentTime = new Date().toISOString();

    let query = supabase
        .from('events')
        .select(
            `
            *,
            event_types(name),
            locations(name, city),
            organiser_profiles(name)
        `,
            { count: 'exact' }
        )
        .eq('is_published', true)
        .gt('ends_at', currentTime)
        .order('starts_at', { ascending: sort !== 'latest' })
        .range(0, page * ITEMS_PER_PAGE - 1);

    // Adding search filter if present
    if (search) {
        query = query.ilike('title', `%${search}%`);
    }

    // Adding type filter if present
    if (type && type !== 'all') {
        query = query.eq('type_id', type);
    }

    const { data: events, error, count } = await query;

    if (error) {
        console.error('Error:', error);
        return <div>Failed to load events</div>;
    }

    const hasMore = Boolean(count && events && events.length < count);

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
                                        No events found. Try adjusting the
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
