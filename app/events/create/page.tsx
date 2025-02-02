import { checkOrganiserProfile } from '@/utils/check-organiser-profile';
import { createClient } from '@/utils/supabase/server';
import { EventForm } from './event-form';

export default async function CreateEventPage() {
    // This will redirect if organiser profile is incomplete
    const organiserProfile = await checkOrganiserProfile();

    const supabase = await createClient();

    // Getting event types and locations for the select inputs
    const { data: eventTypes } = await supabase
        .from('event_types')
        .select('id, name');
    const { data: locations } = await supabase
        .from('locations')
        .select('id, name, city');

    return (
        <EventForm eventTypes={eventTypes || []} locations={locations || []} />
    );
}
