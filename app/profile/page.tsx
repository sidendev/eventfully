import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { UserCircle } from 'lucide-react';

export default async function ProfilePage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect('/sign-in');
    }

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
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                                    <UserCircle className="w-12 h-12 text-muted-foreground" />
                                </div>
                                <Button variant="outline">Change Photo</Button>
                            </div>

                            {/* Profile Form */}
                            <form className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        placeholder="Your username"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Textarea
                                        id="bio"
                                        placeholder="Tell us about yourself"
                                        rows={4}
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
                                    <Button type="submit">Save Changes</Button>
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
