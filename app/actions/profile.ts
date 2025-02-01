'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { encodedRedirect } from '@/utils/utils';

export async function updateProfile(formData: FormData) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
        return encodedRedirect('error', '/sign-in', 'Not authenticated');
    }

    // Get the profile first to ensure we have the correct ID
    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

    if (!profile) {
        return encodedRedirect('error', '/profile', 'Profile not found');
    }

    const username = formData.get('username') as string;
    const bio = formData.get('bio') as string;

    const { error } = await supabase
        .from('profiles')
        .update({
            username,
            bio,
            updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

    if (error) {
        return encodedRedirect('error', '/profile', error.message);
    }

    revalidatePath('/profile');
    return encodedRedirect(
        'success',
        '/profile',
        'Profile updated successfully'
    );
}
