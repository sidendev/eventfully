import { createClient } from '@/utils/supabase/server';
import {
    Calendar,
    MapPin,
    Share2,
    ArrowLeft,
    Clock,
    Building2,
    Ticket,
} from 'lucide-react';
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
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { isAfter } from 'date-fns';

type Props = {
    params: Promise<{ id: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function EventPage(props: Props) {
    const [{ id }, searchParams] = await Promise.all([
        props.params,
        props.searchParams,
    ]);

    const supabase = await createClient();

    const currentTime = new Date();

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
        .eq('id', id)
        .single();

    if (error || !event) {
        console.error('Error fetching event:', error);
        notFound();
    }

    const hasEnded = isAfter(currentTime, new Date(event.ends_at));

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
                                About this event:
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
                                        <Calendar className="w-5 h-5 mt-0.5 text-muted-foreground" />
                                        <div>
                                            <div className="font-medium">
                                                Date and time
                                            </div>
                                            <div className="text-muted-foreground space-y-1">
                                                <div>
                                                    <span className="text-foreground/70">
                                                        Starts:
                                                    </span>{' '}
                                                    {formatDate(
                                                        event.starts_at
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="text-foreground/70">
                                                        Ends:
                                                    </span>{' '}
                                                    {formatDate(event.ends_at)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 mt-0.5 text-muted-foreground" />
                                        <div>
                                            <div className="font-medium">
                                                Location
                                            </div>
                                            <div className="text-muted-foreground">
                                                {event.locations.name}
                                                {event.locations.address && (
                                                    <>
                                                        <br />
                                                        {
                                                            event.locations
                                                                .address
                                                        }
                                                    </>
                                                )}
                                                <br />
                                                {event.locations.city}
                                                {event.locations.country &&
                                                    `, ${event.locations.country}`}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Ticket className="w-5 h-5 mt-0.5 text-muted-foreground" />
                                        <div>
                                            <div className="font-medium">
                                                Tickets Available
                                            </div>
                                            <div className="text-muted-foreground">
                                                {event.max_attendees > 0
                                                    ? `${event.max_attendees} tickets remaining`
                                                    : 'Sold out'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    asChild={event.is_published && !hasEnded}
                                    className="w-full"
                                    size="lg"
                                    disabled={!event.is_published || hasEnded}
                                >
                                    {event.is_published && !hasEnded ? (
                                        <Link href={`/events/${event.id}/book`}>
                                            {event.is_free
                                                ? 'Register Now'
                                                : `Book Now - £${event.ticket_price}`}
                                        </Link>
                                    ) : (
                                        <span>
                                            {!event.is_published
                                                ? 'Tickets Unavailable'
                                                : 'Event Has Ended'}
                                        </span>
                                    )}
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
                                <CardTitle>Organiser:</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-start space-x-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage
                                            src={
                                                event.organiser_profiles
                                                    .profile_image_url
                                            }
                                            alt={event.organiser_profiles.name}
                                        />
                                        <AvatarFallback>
                                            <Building2 className="h-6 w-6" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-1">
                                        <h3 className="font-medium leading-none">
                                            {event.organiser_profiles.name}
                                        </h3>
                                        {event.organiser_profiles
                                            .description && (
                                            <p className="text-sm text-muted-foreground">
                                                {
                                                    event.organiser_profiles
                                                        .description
                                                }
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
