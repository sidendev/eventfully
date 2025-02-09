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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCircle2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { signOutAction } from '@/app/actions';

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

export const metadata = {
    metadataBase: new URL(defaultUrl),
    title: 'Eventfully | Find Local Events',
    description:
        'Discover and join events in your community, or create your own with Eventfully - the easiest way to find and create local events.',
    keywords: ['events', 'local events', 'community events', 'event planning'],
    icons: {
        icon: [
            { url: '/favicon.ico' },
            { url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
        ],
        shortcut: '/favicon.ico',
        apple: '/favicon.ico',
    },
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

    const { data: profile } = user
        ? await supabase
              .from('profiles')
              .select('avatar_url')
              .eq('user_id', user.id)
              .single()
        : { data: null };

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
                                        <div className="flex-shrink-0">
                                            <Link
                                                href="/"
                                                className="text-2xl font-extrabold hover:text-primary transition-colors"
                                            >
                                                Eventfully
                                            </Link>
                                        </div>

                                        <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
                                            <Link
                                                href="/"
                                                className="hover:text-primary transition-colors"
                                            >
                                                Browse Events
                                            </Link>
                                            {user && (
                                                <Link
                                                    href="/events/create"
                                                    className="hover:text-primary transition-colors"
                                                >
                                                    Create Event
                                                </Link>
                                            )}
                                        </nav>

                                        <div className="flex items-center gap-4">
                                            {user ? (
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href="/profile"
                                                        className="hover:opacity-80 transition-opacity"
                                                    >
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage
                                                                src={
                                                                    profile?.avatar_url ||
                                                                    ''
                                                                }
                                                                alt="Profile"
                                                            />
                                                            <AvatarFallback>
                                                                <UserCircle2 className="h-5 w-5" />
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    </Link>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                className="h-8 w-8 p-0"
                                                            >
                                                                <span className="sr-only">
                                                                    Open menu
                                                                </span>
                                                                <ChevronDown className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                asChild
                                                            >
                                                                <Link
                                                                    href="/"
                                                                    className="w-full"
                                                                >
                                                                    Browse
                                                                    Events
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                asChild
                                                            >
                                                                <Link
                                                                    href="/events/create"
                                                                    className="w-full"
                                                                >
                                                                    Create Event
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                asChild
                                                            >
                                                                <Link
                                                                    href="/my-events"
                                                                    className="w-full"
                                                                >
                                                                    My Events
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                asChild
                                                            >
                                                                <Link
                                                                    href="/profile"
                                                                    className="w-full"
                                                                >
                                                                    Profile
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                asChild
                                                            >
                                                                <Link
                                                                    href="/organiser"
                                                                    className="w-full"
                                                                >
                                                                    Organiser
                                                                    Settings
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem>
                                                                <form
                                                                    action={
                                                                        signOutAction
                                                                    }
                                                                    className="w-full"
                                                                >
                                                                    <button
                                                                        type="submit"
                                                                        className="w-full text-left"
                                                                    >
                                                                        Sign out
                                                                    </button>
                                                                </form>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            ) : (
                                                <HeaderAuth />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </nav>
                        </header>

                        <main className="flex-1 flex flex-col items-center justify-center">
                            <div className="w-full">{children}</div>
                        </main>

                        <footer className="border-t border-t-foreground/10 py-4 mt-8">
                            <div className="container mx-auto px-4 flex items-center whitespace-nowrap">
                                <div className="flex-1 pl-4">
                                    <ThemeSwitcher />
                                </div>
                                <p className="flex-1 text-center text-sm text-muted-foreground">
                                    © {new Date().getFullYear()} Eventfully
                                </p>
                                <div className="flex-1"></div>
                            </div>
                        </footer>
                    </div>
                </ThemeProvider>
                <Toaster position="top-center" />
            </body>
        </html>
    );
}
