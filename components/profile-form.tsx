'use client';

import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { SubmitButton } from '@/components/submit-button';
import { UploadImage } from '@/components/upload-image';
import { useRouter } from 'next/navigation';

export function ProfileForm({
    profile,
    action,
    userEmail,
}: {
    profile: any;
    action: any;
    userEmail: string;
}) {
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        try {
            console.log('Submitting form...'); // Debug log
            const result = await action(formData);
            console.log('Received result:', result); // Debug log

            if (result && 'type' in result) {
                // Handle direct response
                if (result.type === 'success') {
                    toast.success(result.message);
                    router.refresh();
                } else {
                    toast.error(result.message);
                }
                return;
            }

            // Handle redirect response (fallback)
            if (result && typeof result === 'string') {
                console.log('String result:', result); // Debug log
                const params = new URLSearchParams(result.split('?')[1]);
                const type = params.get('type');
                const message = params.get('message');
                console.log('Parsed params:', { type, message }); // Debug log

                if (type === 'success') {
                    toast.success(message || 'Profile updated successfully');
                    router.refresh();
                } else {
                    toast.error(message || 'Failed to update profile');
                }
                return;
            }

            console.log('Unexpected result format:', result); // Debug log
            toast.error('Unexpected response format');
        } catch (error) {
            console.error('Submit error:', error);
            toast.error('Failed to update profile');
        }
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            <UploadImage
                defaultValue={profile?.avatar_url}
                name="avatar_url"
                endpoint="profileImage"
            />

            <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                    id="username"
                    name="username"
                    placeholder="Your username"
                    defaultValue={profile?.username || ''}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                    id="bio"
                    name="bio"
                    placeholder="Share a bit about yourself"
                    defaultValue={profile?.bio || ''}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" value={userEmail} disabled />
            </div>

            <div className="pt-4 flex justify-between items-center">
                <SubmitButton pendingText="Saving Changes...">
                    Save Changes
                </SubmitButton>
                <Button variant="outline" asChild>
                    <Link href="/events/create">Create Event</Link>
                </Button>
            </div>
        </form>
    );
}
