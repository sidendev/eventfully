import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function checkOrganiserProfile() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return redirect('/sign-in');

    const { data: organiserProfile } = await supabase
        .from('organiser_profiles')
        .select('name, description, profile_image_url')
        .eq('user_id', user.id)
        .single();

    // Checking if essential fields are completed for organiser profile
    if (!organiserProfile?.name || !organiserProfile?.description) {
        return redirect(
            '/organiser?message=Please complete your organiser profile before creating an event'
        );
    }

    return organiserProfile;
}
