import { hasEnvVars } from '@/utils/supabase/check-env-vars';

export default async function Home() {
    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 container mx-auto px-4 py-8">
                <section className="space-y-8">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                            Find local events near you
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Discover and join events in your community, or
                            create your own.
                        </p>
                    </div>

                    {!hasEnvVars ? (
                        <div className="rounded-lg border border-destructive p-4 text-destructive">
                            <p>
                                Please configure your Supabase environment
                                variables to continue.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Event cards will go here */}
                            <div className="rounded-lg border p-4">
                                <p className="text-muted-foreground">
                                    Featured events coming soon...
                                </p>
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
