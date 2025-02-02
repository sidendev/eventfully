import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { createClient } from '@/utils/supabase/server';

const f = createUploadthing();

export const ourFileRouter = {
    profileImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
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

            const { error } = await supabase
                .from('profiles')
                .update({
                    avatar_url: file.url,
                    updated_at: new Date().toISOString(),
                })
                .eq('user_id', metadata.userId);

            if (error) throw error;

            return { uploadedBy: metadata.userId };
        }),
    organiserImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
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

            const { error } = await supabase
                .from('organiser_profiles')
                .update({
                    profile_image_url: file.url, // Note: using profile_image_url as per schema
                    updated_at: new Date().toISOString(),
                })
                .eq('user_id', metadata.userId);

            if (error) throw error;

            return { uploadedBy: metadata.userId };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
