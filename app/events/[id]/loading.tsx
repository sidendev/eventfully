export default function EventLoading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="h-4 w-24 bg-muted rounded animate-pulse mb-8" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="aspect-video w-full rounded-lg bg-muted animate-pulse" />

                    <div className="space-y-4">
                        <div className="h-8 bg-muted rounded w-3/4 animate-pulse" />
                        <div className="space-y-2">
                            <div className="h-4 bg-muted rounded w-1/3 animate-pulse" />
                            <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="h-6 bg-muted rounded w-1/4 animate-pulse" />
                        <div className="space-y-2">
                            <div className="h-4 bg-muted rounded animate-pulse" />
                            <div className="h-4 bg-muted rounded animate-pulse" />
                            <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="rounded-lg border p-6 space-y-6">
                        <div className="h-10 bg-muted rounded animate-pulse" />
                        <div className="h-10 bg-muted rounded animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
}
