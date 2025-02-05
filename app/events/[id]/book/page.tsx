import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { BookingForm } from './booking-form';
import type { Metadata } from 'next';

type Props = {
    params: Promise<{ id: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BookEventPage(props: Props) {
    // Destructure after awaiting to ensure type safety
    const [{ id }, searchParams] = await Promise.all([
        props.params,
        props.searchParams,
    ]);

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
        .eq('id', id)
        .single();

    if (error || !event) {
        console.error('Error fetching event:', error);
        notFound();
    }

    return <BookingForm event={event} />;
}
