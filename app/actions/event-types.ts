'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createEventType(formData: FormData) {
    try {
        const supabase = await createClient();

        const name = formData.get('name') as string;
        const description = formData.get('description') as string;

        if (!name) {
            return { error: 'Event type name is required' };
        }

        const { data, error } = await supabase
            .from('event_types')
            .insert({
                name,
                description,
            })
            .select()
            .single();

        if (error) throw error;

        revalidatePath('/events/create');
        return { data };
    } catch (error) {
        console.error('Error creating event type:', error);
        return { error: 'Failed to create event type' };
    }
}
