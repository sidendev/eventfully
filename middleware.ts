import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
    const res = await updateSession(request);

    const pathname = request.nextUrl.pathname;
    const protectedPaths = ['/events/create', '/profile'];
    const isProtectedPath = protectedPaths.some((path) =>
        pathname.startsWith(path)
    );

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
            },
        }
    );

    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (isProtectedPath && !session) {
        const redirectUrl = new URL('/sign-in', request.url);
        redirectUrl.searchParams.set('redirect_to', pathname);
        return NextResponse.redirect(redirectUrl);
    }

    return res;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
