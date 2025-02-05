import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { BookingForm } from './booking-form';

interface Props {
    params: Promise<{
        id: string;
    }>;
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function BookEventPage({ params, searchParams }: Props) {
    const resolvedParams = await params;
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
        .eq('id', resolvedParams.id)
        .single();

    if (error || !event) {
        console.error('Error fetching event:', error);
        notFound();
    }

    return <BookingForm event={event} />;
}
