import { signUpAction } from '@/app/actions';
import { FormMessage, Message } from '@/components/form-message';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default async function SignUp(props: {
    searchParams: Promise<Message>;
}) {
    const searchParams = await props.searchParams;
    if ('message' in searchParams) {
        return (
            <div className="p-4">
                <FormMessage message={searchParams} />
            </div>
        );
    }

    console.warn(
        'Note: Emails are rate limited. Enable Custom SMTP to increase the rate limit. Learn more at https://supabase.com/docs/guides/auth/auth-smtp'
    );

    return (
        <form className="space-y-8 p-4">
            <div className="space-y-2">
                <h1 className="text-2xl font-medium">Create an account</h1>
                <p className="text-sm text-foreground">
                    Already have an account?{' '}
                    <Link
                        className="text-foreground font-medium underline"
                        href="/sign-in"
                    >
                        Sign in
                    </Link>
                </p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        name="email"
                        placeholder="you@example.com"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        type="password"
                        name="password"
                        placeholder="Create a password"
                        required
                    />
                </div>

                <SubmitButton
                    pendingText="Creating Account..."
                    formAction={signUpAction}
                >
                    Create Account
                </SubmitButton>
                <FormMessage message={searchParams} />
            </div>
        </form>
    );
}
