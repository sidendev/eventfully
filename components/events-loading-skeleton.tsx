export function EventsLoadingSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-lg border p-6 animate-pulse">
                    <div className="aspect-video w-full mb-4 bg-muted rounded-md" />
                    <div className="h-6 bg-muted rounded w-3/4 mb-4" />
                    <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-full" />
                        <div className="h-4 bg-muted rounded w-5/6" />
                    </div>
                </div>
            ))}
        </div>
    );
}
