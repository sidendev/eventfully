import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { UserCircle } from 'lucide-react';
import { updateProfile } from '@/app/actions/profile';
import { SubmitButton } from '@/components/submit-button';
import { UploadImage } from '@/components/upload-image';

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
        .eq('id', user.id)
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
                            {/* Profile Picture Section */}
                            <UploadImage defaultValue={profile?.avatar_url} />

                            {/* Profile Form */}
                            <form action={updateProfile} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        name="username"
                                        placeholder="Your username"
                                        defaultValue={profile?.username || ''}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Textarea
                                        id="bio"
                                        name="bio"
                                        placeholder="Tell us about yourself"
                                        rows={4}
                                        defaultValue={profile?.bio || ''}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        type="email"
                                        id="email"
                                        value={user.email}
                                        disabled
                                    />
                                </div>

                                <div className="pt-4 flex justify-between items-center">
                                    <SubmitButton pendingText="Saving Changes...">
                                        Save Changes
                                    </SubmitButton>
                                    <Button variant="outline" asChild>
                                        <Link href="/events/create">
                                            Create Event
                                        </Link>
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
