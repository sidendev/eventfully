import { signOutAction } from '@/app/actions';
import { hasEnvVars } from '@/utils/supabase/check-env-vars';
import Link from 'next/link';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { createClient } from '@/utils/supabase/server';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

export default async function AuthButton() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!hasEnvVars) {
        return (
            <>
                <div className="flex gap-4 items-center">
                    <div>
                        <Badge
                            variant={'default'}
                            className="font-normal pointer-events-none"
                        >
                            Please update .env.local file with anon key and url
                        </Badge>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            asChild
                            size="sm"
                            variant={'outline'}
                            disabled
                            className="opacity-75 cursor-none pointer-events-none"
                        >
                            <Link href="/sign-in">Sign in</Link>
                        </Button>
                        <Button
                            asChild
                            size="sm"
                            variant={'default'}
                            disabled
                            className="opacity-75 cursor-none pointer-events-none"
                        >
                            <Link href="/sign-up">Sign up</Link>
                        </Button>
                    </div>
                </div>
            </>
        );
    }
    return user ? (
        <div className="flex items-center gap-4">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                        {user.email}
                        <ChevronDown size={16} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <Link href="/profile" className="w-full">
                            Profile
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/organiser" className="w-full">
                            Organiser Dashboard
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <form action={signOutAction} className="w-full">
                            <button type="submit" className="w-full text-left">
                                Sign out
                            </button>
                        </form>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    ) : (
        <div className="flex gap-2">
            <Button asChild size="sm" variant={'outline'}>
                <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild size="sm" variant={'default'}>
                <Link href="/sign-up">Sign up</Link>
            </Button>
        </div>
    );
}
