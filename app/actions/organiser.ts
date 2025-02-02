'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { encodedRedirect } from '@/utils/utils';

export async function updateOrganiserProfile(formData: FormData) {
    try {
        const supabase = await createClient();

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return encodedRedirect('error', '/sign-in', 'Not authenticated');
        }

        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const website_url = formData.get('website_url') as string;
        const contact_email = formData.get('contact_email') as string;
        const profile_image_url = formData.get('profile_image_url') as string;

        if (!name) {
            return encodedRedirect(
                'error',
                '/organiser',
                'Organisation name is required'
            );
        }

        // checking if the organiser name is already taken
        const { data: existingName } = await supabase
            .from('organiser_profiles')
            .select('user_id')
            .eq('name', name)
            .neq('user_id', user.id)
            .single();

        if (existingName) {
            return encodedRedirect(
                'error',
                '/organiser',
                'Organisation name already taken'
            );
        }

        // Updating the organiser profile
        const { error: updateError } = await supabase
            .from('organiser_profiles')
            .update({
                name,
                description,
                website_url,
                contact_email,
                profile_image_url,
                slug: name.toLowerCase().replace(/\s+/g, '-'),
            })
            .eq('user_id', user.id);

        if (updateError) {
            console.error('Update error:', updateError);
            return encodedRedirect('error', '/organiser', updateError.message);
        }

        revalidatePath('/organiser');
        return encodedRedirect(
            'success',
            '/organiser',
            'Organiser profile updated successfully'
        );
    } catch (error) {
        console.error('Organiser profile update error:', error);
        return encodedRedirect(
            'error',
            '/organiser',
            'Failed to update organiser profile'
        );
    }
}
