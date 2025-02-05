import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { BookingForm } from './booking-form';

interface Props {
    // We declare that `params` is a promise that resolves to an object with `id`
    params: Promise<{
        id: string;
    }>;
    searchParams: { [key: string]: string | string[] | undefined };
}

// interface Props {
//     params: {
//         id: string;
//     };
//     searchParams: { [key: string]: string | string[] | undefined };
// }

export default async function BookEventPage({ params, searchParams }: Props) {
    // IMPORTANT: Await the params promise first
    const resolvedParams = await params;
    // Now we can safely use resolvedParams.id
    const eventId = resolvedParams.id;

    const supabase = await createClient();

    const { data: event, error } = await supabase
        .from('events')
        .select(
            `
            *,
            locations (*),
            event_types (*),
            organiser_profiles (*)
        `
        )
        .eq('id', eventId)
        .single();

    if (error || !event) {
        console.error('Error fetching event:', error);
        notFound();
    }

    return <BookingForm event={event} />;
}
