'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { encodedRedirect } from '@/utils/utils';

export async function updateProfile(formData: FormData) {
    try {
        console.log('Starting profile update...'); // Debug log
        const supabase = await createClient();

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            console.log('No user found'); // Debug log
            return encodedRedirect('error', '/sign-in', 'Not authenticated');
        }

        const username = formData.get('username') as string;
        const bio = formData.get('bio') as string;
        const avatar_url = formData.get('avatar_url') as string;

        console.log('Form data received:', { username, bio, avatar_url }); // Debug log

        if (!username) {
            return encodedRedirect('error', '/profile', 'Username is required');
        }

        // First checking if username is already taken (excluding current user)
        const { data: existingUsername } = await supabase
            .from('profiles')
            .select('user_id')
            .eq('username', username)
            .neq('user_id', user.id)
            .single();

        if (existingUsername) {
            return encodedRedirect(
                'error',
                '/profile',
                'Username already taken'
            );
        }

        // Updating the profile
        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                username,
                bio,
                avatar_url,
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', user.id);

        if (updateError) {
            console.log('Update error:', updateError); // Debug log
            return encodedRedirect('error', '/profile', updateError.message);
        }

        console.log('Profile updated successfully'); // Debug log
        revalidatePath('/profile');

        // Trying returning a direct response instead of redirect for testing
        return { type: 'success', message: 'Profile updated successfully' };
    } catch (error) {
        console.error('Profile update error:', error);
        return { type: 'error', message: 'Failed to update profile' };
    }
}
