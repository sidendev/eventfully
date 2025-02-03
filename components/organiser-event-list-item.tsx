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
import { deleteEvent } from '@/app/actions/events';

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

    const handleDelete = async () => {
        try {
            await deleteEvent(event.id);
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    return (
        <Card className="hover:shadow-md transition-shadow">
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
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge
                                variant={isUpcoming ? 'default' : 'secondary'}
                            >
                                {isUpcoming ? 'Upcoming' : 'Past'}
                            </Badge>
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
                                    {event.is_published ? (
                                        <Badge
                                            variant="secondary"
                                            className="text-xs"
                                        >
                                            Published
                                        </Badge>
                                    ) : (
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            Draft
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
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/events/${event.id}/edit`}>
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit event</span>
                            </Link>
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                    <span className="sr-only">
                                        Delete event
                                    </span>
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Delete Event
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete this
                                        event? This action cannot be undone and
                                        will cancel all existing bookings.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        Delete
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
