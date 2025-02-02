import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { createClient } from '@/utils/supabase/server';

const f = createUploadthing();

export const ourFileRouter = {
    profileImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
        .middleware(async ({ req }) => {
            const supabase = await createClient();
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) throw new Error('Unauthorized');

            return { userId: user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            return { uploadedBy: metadata.userId, url: file.url };
        }),
    organiserImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
        .middleware(async ({ req }) => {
            const supabase = await createClient();
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) throw new Error('Unauthorized');

            return { userId: user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            return { uploadedBy: metadata.userId, url: file.url };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
