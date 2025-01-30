import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function EventNotFound() {
    return (
        <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-4xl font-bold mb-4">Event Not Found</h1>
            <p className="text-muted-foreground mb-8">
                The event you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
                <Link href="/events">Browse Other Events</Link>
            </Button>
        </div>
    );
}
