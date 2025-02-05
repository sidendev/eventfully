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

    const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}/auth/callback`,
        },
    });

    if (signUpError) {
        return encodedRedirect('error', '/sign-up', signUpError.message);
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

export async function forgotPasswordAction(formData: FormData) {
    const email = formData.get('email') as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/protected/reset-password`,
    });

    if (error) {
        return redirect('/forgot-password?error=Could not send reset email');
    }

    return redirect(
        '/forgot-password?success=Check your email for a password reset link'
    );
}

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
