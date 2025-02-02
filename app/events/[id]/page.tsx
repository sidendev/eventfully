import { createClient } from '@/utils/supabase/server';
import { Calendar, MapPin, Share2, ArrowLeft, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

interface EventPageProps {
    params: {
        id: string;
    };
}

export default async function EventPage({ params }: EventPageProps) {
    const supabase = await createClient();

    const { data: event, error } = await supabase
        .from('events')
        .select(
            `
            *,
            locations (*),
            event_types (*),
            organiser_profiles (*)
        `
        )
        .eq('id', params.id)
        .single();

    if (error || !event) {
        console.error('Error fetching event:', error);
        notFound();
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <Link
                    href="/"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Back to events
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {event.image_url && (
                            <div className="aspect-video w-full overflow-hidden rounded-lg">
                                <img
                                    src={event.image_url}
                                    alt={event.title}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        )}

                        <div>
                            <div className="text-sm text-muted-foreground mb-2">
                                {event.event_types.name}
                            </div>
                            <h1 className="text-4xl font-bold">
                                {event.title}
                            </h1>
                            <p className="text-xl text-muted-foreground mt-4">
                                {event.short_description}
                            </p>
                        </div>

                        <div className="prose prose-gray dark:prose-invert max-w-none">
                            <h2 className="text-2xl font-semibold mb-4">
                                About this event
                            </h2>
                            <p className="whitespace-pre-wrap">
                                {event.full_description}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Event Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-5 h-5 mt-0.5" />
                                        <div>
                                            <div className="font-medium">
                                                Date and time
                                            </div>
                                            <div className="text-muted-foreground">
                                                {formatDate(event.starts_at)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 mt-0.5" />
                                        <div>
                                            <div className="font-medium">
                                                Location
                                            </div>
                                            <div className="text-muted-foreground">
                                                {event.locations.name}
                                                <br />
                                                {event.locations.address}
                                                <br />
                                                {event.locations.city},{' '}
                                                {event.locations.country}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Clock className="w-5 h-5 mt-0.5" />
                                        <div>
                                            <div className="font-medium">
                                                Duration
                                            </div>
                                            <div className="text-muted-foreground">
                                                {formatDate(event.ends_at)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Button asChild className="w-full" size="lg">
                                    <Link href={`/events/${event.id}/book`}>
                                        {event.is_free
                                            ? 'Register Now'
                                            : `Book Now - £${event.ticket_price}`}
                                    </Link>
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-full"
                                    size="lg"
                                >
                                    <Share2 className="w-4 h-4 mr-2" />
                                    Share Event
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Organiser</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="font-medium">
                                    {event.organiser_profiles.name}
                                </div>
                                <p className="text-muted-foreground mt-1">
                                    {event.organiser_profiles.description}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
