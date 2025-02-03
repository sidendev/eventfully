'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { isAfter } from 'date-fns';
import { Button } from './ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cancelEvent } from '@/app/actions/events';
import { cn } from '@/lib/utils';

interface Event {
    id: string;
    title: string;
    description?: string;
    starts_at: string;
    ends_at: string;
    image_url?: string;
    is_all_day?: boolean;
    locations: {
        name: string;
        city: string;
        address?: string;
    };
    event_types?: {
        name: string;
    };
    confirmedBookings: number;
    totalBookings: number;
    max_attendees?: number;
    ticket_price: number;
    is_published: boolean;
}

interface OrganiserEventListItemProps {
    event: Event;
}

export function OrganiserEventListItem({ event }: OrganiserEventListItemProps) {
    const isUpcoming = isAfter(new Date(event.starts_at), new Date());

    const handleCancel = async () => {
        try {
            await cancelEvent(event.id);
        } catch (error) {
            console.error('Error cancelling event:', error);
        }
    };

    return (
        <Card
            className={cn(
                'hover:shadow-md transition-shadow',
                !event.is_published && 'opacity-75'
            )}
        >
            <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 overflow-visible">
                    <Link
                        href={`/events/${event.id}`}
                        className="w-full sm:w-24 h-24 rounded-md overflow-hidden group relative"
                    >
                        {event.image_url ? (
                            <>
                                <Image
                                    src={event.image_url}
                                    alt={event.title}
                                    fill
                                    className="object-cover transition-transform group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                            </>
                        ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                                <Calendar className="h-8 w-8 text-muted-foreground" />
                            </div>
                        )}
                    </Link>

                    <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2 mb-1">
                            {event.is_published && (
                                <Badge
                                    variant={
                                        isUpcoming ? 'default' : 'secondary'
                                    }
                                >
                                    {isUpcoming ? 'Upcoming' : 'Past'}
                                </Badge>
                            )}
                            {!event.is_published && (
                                <Badge
                                    variant="destructive"
                                    className="border-2 border-destructive"
                                >
                                    Cancelled
                                </Badge>
                            )}
                            {event.event_types?.name && (
                                <Badge variant="outline">
                                    {event.event_types.name}
                                </Badge>
                            )}
                        </div>

                        <div>
                            <Link
                                href={`/events/${event.id}`}
                                className="hover:underline"
                            >
                                <h3 className="font-semibold text-lg">
                                    {event.title}
                                </h3>
                            </Link>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mt-1">
                                <p>
                                    {event.confirmedBookings} confirmed
                                    {event.max_attendees &&
                                        ` of ${event.max_attendees} spots`}
                                </p>
                                <div className="flex flex-wrap items-center gap-1">
                                    <Badge
                                        variant="outline"
                                        className="text-xs"
                                    >
                                        {event.ticket_price === 0
                                            ? 'Free'
                                            : `£${event.ticket_price}`}
                                    </Badge>
                                    {event.is_published && (
                                        <Badge
                                            variant="secondary"
                                            className="text-xs"
                                        >
                                            Published
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-muted-foreground mt-2">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 shrink-0" />
                                    <span>{formatDate(event.starts_at)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 shrink-0" />
                                    <span>
                                        {event.locations.name},{' '}
                                        {event.locations.city}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex sm:flex-col gap-2 mt-4 sm:mt-0">
                        {event.is_published ? (
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/events/${event.id}/edit`}>
                                    <Pencil className="h-4 w-4" />
                                    <span className="sr-only">Edit event</span>
                                </Link>
                            </Button>
                        ) : (
                            <Button variant="outline" size="sm" disabled>
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit event</span>
                            </Button>
                        )}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={!event.is_published}
                                >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                    <span className="sr-only">
                                        Cancel event
                                    </span>
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Cancel Event
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to cancel this
                                        event? This action cannot be undone and
                                        will notify all ticket holders. The
                                        event will be marked as cancelled and no
                                        new bookings will be allowed.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Keep Event Active
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleCancel}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        Cancel Event
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
