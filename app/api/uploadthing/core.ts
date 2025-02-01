import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { createClient } from '@/utils/supabase/server';

const f = createUploadthing();

export const ourFileRouter = {
    profileImage: f({
        image: {
            maxFileSize: '4MB',
            maxFileCount: 1,
        },
    })
        .middleware(async () => {
            const supabase = await createClient();
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) throw new Error('Unauthorized');

            // Get the profile to ensure we have the correct user profile
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (!profile) throw new Error('Profile not found');

            return { userId: user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            const supabase = await createClient();

            // Update the profile with the new avatar URL
            const { error } = await supabase
                .from('profiles')
                .update({
                    avatar_url: file.url,
                    updated_at: new Date().toISOString(),
                })
                .eq('user_id', metadata.userId);

            if (error) throw error;

            return { uploadedBy: metadata.userId, avatar: file.url };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
