import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Building2, PlusCircle, CalendarDays } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { updateOrganiserProfile } from '@/app/actions/organiser';
import { SubmitButton } from '@/components/submit-button';
import { UploadImage } from '@/components/upload-image';

export default async function OrganiserPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect('/sign-in');
    }

    const { data: organiserProfile } = await supabase
        .from('organiser_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold">
                                    Organiser Dashboard
                                </h1>
                                <p className="text-muted-foreground mt-2">
                                    Manage your Event organiser profile and
                                    events
                                </p>
                            </div>
                            <Button asChild>
                                <Link
                                    href="/events/create"
                                    className="flex items-center gap-2"
                                >
                                    <PlusCircle size={20} />
                                    Create Event
                                </Link>
                            </Button>
                        </div>

                        <Tabs defaultValue="overview" className="space-y-6">
                            <TabsList>
                                <TabsTrigger value="overview">
                                    Overview
                                </TabsTrigger>
                                <TabsTrigger value="profile">
                                    Organiser Profile
                                </TabsTrigger>
                                <TabsTrigger value="events">Events</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Building2 className="h-4 w-4" />
                                                Organisation
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-2xl font-bold">
                                                {organiserProfile?.name ||
                                                    'Not set'}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Organiser Name
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <CalendarDays className="h-4 w-4" />
                                                Events
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-2xl font-bold">
                                                0
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Total Events
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>

                            <TabsContent value="profile" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Organiser Profile</CardTitle>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            Complete your organiser profile to
                                            start creating and managing events.
                                            This information will be visible to
                                            event attendees.
                                        </p>
                                    </CardHeader>
                                    <CardContent>
                                        {!organiserProfile?.name && (
                                            <div className="mb-6 p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                                                <p className="text-sm font-medium">
                                                    ⚠️ Your organiser profile
                                                    needs to be completed before
                                                    you can create events.
                                                </p>
                                            </div>
                                        )}
                                        <form
                                            action={updateOrganiserProfile}
                                            className="space-y-4"
                                        >
                                            <UploadImage
                                                defaultValue={
                                                    organiserProfile?.profile_image_url
                                                }
                                                name="profile_image_url"
                                                endpoint="organiserImage"
                                            />

                                            <div className="space-y-2">
                                                <Label htmlFor="name">
                                                    Organisation Name
                                                </Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    placeholder="Your organisation name"
                                                    defaultValue={
                                                        organiserProfile?.name ||
                                                        ''
                                                    }
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="description">
                                                    Description
                                                </Label>
                                                <Textarea
                                                    id="description"
                                                    name="description"
                                                    placeholder="Tell people about your organisation"
                                                    defaultValue={
                                                        organiserProfile?.description ||
                                                        ''
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="website">
                                                    Website
                                                </Label>
                                                <Input
                                                    id="website"
                                                    name="website_url"
                                                    type="url"
                                                    defaultValue={
                                                        organiserProfile?.website_url ||
                                                        ''
                                                    }
                                                    placeholder="https://your-website.com"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="contact">
                                                    Contact Email
                                                </Label>
                                                <Input
                                                    id="contact"
                                                    name="contact_email"
                                                    type="email"
                                                    defaultValue={
                                                        organiserProfile?.contact_email ||
                                                        ''
                                                    }
                                                    placeholder="contact@your-organisation.com"
                                                />
                                            </div>

                                            <div className="flex justify-end">
                                                <SubmitButton pendingText="Saving Changes...">
                                                    Save Changes
                                                </SubmitButton>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="events" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Your Events</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-center py-6">
                                            <p className="text-muted-foreground">
                                                No events created yet
                                            </p>
                                            <Button asChild className="mt-4">
                                                <Link href="/events/create">
                                                    Create Your First Event
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </main>
        </div>
    );
}
