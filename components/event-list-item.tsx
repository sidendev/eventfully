'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { AddToCalendar } from '@/components/ui/add-to-calendar-wrapper';
import { Badge } from '@/components/ui/badge';
import { isAfter } from 'date-fns';

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
}

interface EventListItemProps {
    event: Event;
}

export function EventListItem({ event }: EventListItemProps) {
    const isUpcoming = isAfter(new Date(event.starts_at), new Date());

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-0">
                <div className="flex items-center gap-4 p-4 overflow-visible">
                    <Link
                        href={`/events/${event.id}`}
                        className="shrink-0 relative w-24 h-24 rounded-md overflow-hidden group"
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

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
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
                        <Link
                            href={`/events/${event.id}`}
                            className="hover:underline"
                        >
                            <h3 className="font-semibold text-lg truncate">
                                {event.title}
                            </h3>
                        </Link>
                        <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(event.starts_at)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>
                                    {event.locations.name},{' '}
                                    {event.locations.city}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="shrink-0">
                        <div
                            className="relative"
                            style={{ position: 'static' }}
                        >
                            <AddToCalendar event={event} />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
