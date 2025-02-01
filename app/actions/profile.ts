'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { encodedRedirect } from '@/utils/utils';

export async function updateProfile(formData: FormData) {
    try {
        const supabase = await createClient();

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return encodedRedirect('error', '/sign-in', 'Not authenticated');
        }

        const username = formData.get('username') as string;
        const bio = formData.get('bio') as string;
        const avatar_url = formData.get('avatar_url') as string;

        if (!username) {
            return encodedRedirect('error', '/profile', 'Username is required');
        }

        // First check if username is already taken (excluding current user)
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

        console.log('Updating profile for user:', user.id);
        console.log('Form data:', { username, bio, avatar_url });

        // Update the profile
        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                username,
                bio,
                avatar_url,
            })
            .eq('user_id', user.id);

        console.log('Update response:', updateError);

        if (updateError) {
            console.error('Update error:', updateError);
            return encodedRedirect('error', '/profile', updateError.message);
        }

        revalidatePath('/profile');
        return encodedRedirect(
            'success',
            '/profile',
            'Profile updated successfully'
        );
    } catch (error) {
        console.error('Profile update error:', error);
        return encodedRedirect('error', '/profile', 'Failed to update profile');
    }
}
