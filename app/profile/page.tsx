import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { ProfileForm } from '@/components/profile-form';
import { updateProfile } from '@/app/actions/profile';

export default async function ProfilePage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect('/sign-in');
    }

    // Getting the user's profile data
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold">
                                Profile Settings
                            </h1>
                            <p className="text-muted-foreground mt-2">
                                Manage your account settings and profile
                                information.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <ProfileForm
                                profile={profile}
                                action={updateProfile}
                                userEmail={user.email || ''}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
