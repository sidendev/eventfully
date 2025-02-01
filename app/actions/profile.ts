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

    const username = formData.get('username') as string;
    const bio = formData.get('bio') as string;

    const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        username,
        bio,
        updated_at: new Date().toISOString(),
    });

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
