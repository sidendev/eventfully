import { createClient } from '@/utils/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { EditEventForm } from './edit-event-form';

type Props = {
    params: Promise<{ id: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function EditEventPage(props: Props) {
    const [{ id }, searchParams] = await Promise.all([
        props.params,
        props.searchParams,
    ]);

    const supabase = await createClient();

    // Checking if user is authenticated
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/sign-in');
    }

    // Get user's organiser profile
    const { data: organiserProfile } = await supabase
        .from('organiser_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

    if (!organiserProfile) {
        redirect('/organiser');
    }

    // Fetching the event with all related data
    const { data: event, error: eventError } = await supabase
        .from('events')
        .select('*, locations (*), event_types (*)')
        .eq('id', id)
        .eq('organiser_profile_id', organiserProfile.id)
        .single();

    if (eventError || !event) {
        console.error('Error fetching event:', eventError);
        notFound();
    }

    // Checking if event is cancelled
    if (!event.is_published) {
        redirect('/organiser');
    }

    // Getting event types and locations for the select inputs
    const { data: eventTypes } = await supabase
        .from('event_types')
        .select('id, name');
    const { data: locations } = await supabase
        .from('locations')
        .select('id, name, city');

    return (
        <EditEventForm
            eventTypes={eventTypes || []}
            locations={locations || []}
            event={event}
        />
    );
}
