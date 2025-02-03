import HeaderAuth from '@/components/header-auth';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { createClient } from '@/utils/supabase/server';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import Link from 'next/link';
import './globals.css';
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin';
import { extractRouterConfig } from 'uploadthing/server';
import { ourFileRouter } from '@/app/api/uploadthing/core';
import { Toaster } from 'sonner';

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

export const metadata = {
    metadataBase: new URL(defaultUrl),
    title: 'Eventfully | Find Local Events',
    description:
        'Discover and join events in your community, or create your own with Eventfully - the easiest way to find and create local events.',
    keywords: ['events', 'local events', 'community events', 'event planning'],
    openGraph: {
        title: 'Eventfully | Find Local Events',
        description:
            'Discover and join events in your community, or create your own.',
        type: 'website',
    },
};

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
});

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <html
            lang="en"
            className={`${inter.variable}`}
            suppressHydrationWarning
        >
            <body
                className={`${inter.className} bg-background text-foreground`}
                suppressHydrationWarning
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <NextSSRPlugin
                        routerConfig={extractRouterConfig(ourFileRouter)}
                    />
                    <div className="min-h-screen flex flex-col">
                        <header>
                            <nav className="border-b border-b-foreground/10">
                                <div className="container mx-auto px-4">
                                    <div className="h-16 flex items-center justify-between">
                                        <div className="flex items-center gap-8">
                                            <Link
                                                href="/"
                                                className="text-xl font-semibold hover:text-primary transition-colors"
                                            >
                                                Eventfully
                                            </Link>
                                            <nav className="hidden md:flex items-center gap-6">
                                                <Link
                                                    href="/events"
                                                    className="hover:text-primary transition-colors"
                                                >
                                                    Browse Events
                                                </Link>
                                                {user && (
                                                    <>
                                                        <Link
                                                            href="/profile"
                                                            className="hover:text-primary transition-colors"
                                                        >
                                                            Profile
                                                        </Link>
                                                        <Link
                                                            href="/events/create"
                                                            className="hover:text-primary transition-colors"
                                                        >
                                                            Create Event
                                                        </Link>
                                                    </>
                                                )}
                                            </nav>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <ThemeSwitcher />
                                            <HeaderAuth />
                                        </div>
                                    </div>
                                </div>
                            </nav>
                        </header>

                        <main className="flex-1 flex flex-col items-center justify-center">
                            <div className="w-full">{children}</div>
                        </main>

                        <footer className="border-t border-t-foreground/10 py-6 mt-8">
                            <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                                <p>
                                    © {new Date().getFullYear()} Eventfully.
                                    All rights reserved.
                                </p>
                            </div>
                        </footer>
                    </div>
                </ThemeProvider>
                <Toaster position="top-center" />
            </body>
        </html>
    );
}
