import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { BookingForm } from './booking-form';

export default async function BookingPage({
    params,
}: {
    params: { id: string };
}) {
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
        .eq('id', params.id)
        .single();

    if (error || !event) {
        console.error('Error fetching event:', error);
        notFound();
    }

    return <BookingForm event={event} />;
}
