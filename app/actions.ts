'use server';

import { encodedRedirect } from '@/utils/utils';
import { createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const signUpAction = async (formData: FormData) => {
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();
    const supabase = await createClient();
    const origin = (await headers()).get('origin');

    if (!email || !password) {
        return encodedRedirect(
            'error',
            '/sign-up',
            'Email and password are required'
        );
    }

    const {
        data: { user },
        error: signUpError,
    } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}/auth/callback`,
        },
    });

    if (signUpError) {
        return encodedRedirect('error', '/sign-up', signUpError.message);
    }

    // Create initial profile for the user
    if (user) {
        const { error: profileError } = await supabase.from('profiles').insert({
            user_id: user.id,
            username: email.split('@')[0], // Default username from email
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        });

        if (profileError) {
            console.error('Error creating profile:', profileError);
        }
    }

    return encodedRedirect(
        'success',
        '/sign-up',
        'Check your email for the confirmation link.'
    );
};

export const signInAction = async (formData: FormData) => {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const redirectTo = formData.get('redirect_to') as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return encodedRedirect('error', '/sign-in', error.message);
    }

    return redirect(redirectTo || '/');
};

export const forgotPasswordAction = async (formData: FormData) => {
    const email = formData.get('email')?.toString();
    const supabase = await createClient();
    const origin = (await headers()).get('origin');
    const callbackUrl = formData.get('callbackUrl')?.toString();

    if (!email) {
        return encodedRedirect(
            'error',
            '/forgot-password',
            'Email is required'
        );
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
    });

    if (error) {
        console.error(error.message);
        return encodedRedirect(
            'error',
            '/forgot-password',
            'Could not reset password'
        );
    }

    if (callbackUrl) {
        return redirect(callbackUrl);
    }

    return encodedRedirect(
        'success',
        '/forgot-password',
        'Check your email for a link to reset your password.'
    );
};

export const resetPasswordAction = async (formData: FormData) => {
    const supabase = await createClient();

    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (!password || !confirmPassword) {
        encodedRedirect(
            'error',
            '/protected/reset-password',
            'Password and confirm password are required'
        );
    }

    if (password !== confirmPassword) {
        encodedRedirect(
            'error',
            '/protected/reset-password',
            'Passwords do not match'
        );
    }

    const { error } = await supabase.auth.updateUser({
        password: password,
    });

    if (error) {
        encodedRedirect(
            'error',
            '/protected/reset-password',
            'Password update failed'
        );
    }

    encodedRedirect('success', '/protected/reset-password', 'Password updated');
};

export const signOutAction = async () => {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect('/sign-in');
};
