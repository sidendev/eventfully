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

            return { userId: user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            const supabase = await createClient();

            // Updating the user's profile with the new avatar URL
            await supabase.from('profiles').upsert({
                id: metadata.userId,
                avatar_url: file.url,
                updated_at: new Date().toISOString(),
            });

            return { uploadedBy: metadata.userId, avatar: file.url };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
