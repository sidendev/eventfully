'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createLocation(formData: FormData) {
    try {
        const supabase = await createClient();

        const name = formData.get('name') as string;
        const address = formData.get('address') as string;
        const city = formData.get('city') as string;
        const state = formData.get('state') as string;
        const country = formData.get('country') as string;
        const postal_code = formData.get('postal_code') as string;
        const venue_type = formData.get('venue_type') as string;

        if (!name || !address || !city || !country) {
            return { error: 'Required fields are missing' };
        }

        const { data, error } = await supabase
            .from('locations')
            .insert({
                name,
                address,
                city,
                state,
                country,
                postal_code,
                venue_type,
            })
            .select()
            .single();

        if (error) throw error;

        revalidatePath('/events/create');
        return { data };
    } catch (error) {
        console.error('Error creating location:', error);
        return { error: 'Failed to create location' };
    }
}
