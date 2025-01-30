export default async function EventsPage() {
    const supabase = await createClient();

    const { data: events } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

    return (
        <div>
            {events?.map((event) => <EventCard key={event.id} event={event} />)}
        </div>
    );
}
