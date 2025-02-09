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

    const handleCalendarClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <Link href={`/events/${event.id}`}>
            <Card className="hover:bg-muted/50 transition-colors my-4">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Event Image - 16:9 aspect ratio */}
                        <div className="w-full md:w-[240px] relative">
                            <div className="aspect-video">
                                <img
                                    src={
                                        event.image_url ||
                                        '/images/placeholder.png'
                                    }
                                    alt={event.title}
                                    className="w-full h-full object-cover rounded-md"
                                />
                            </div>
                        </div>

                        {/* Event Details */}
                        <div className="flex-1 min-w-0 space-y-3">
                            <div>
                                <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                                    {event.title}
                                </h3>
                                <p className="text-muted-foreground text-sm line-clamp-2">
                                    {event.description}
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex items-center text-muted-foreground">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    <span className="text-sm">
                                        {formatDate(event.starts_at)}
                                    </span>
                                </div>
                                {event.locations && (
                                    <div className="flex items-center text-muted-foreground">
                                        <MapPin className="h-4 w-4 mr-2" />
                                        <span className="text-sm">
                                            {event.locations.name},{' '}
                                            {event.locations.city}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Add to Calendar Button */}
                            <div
                                className="flex justify-end"
                                onClick={handleCalendarClick}
                            >
                                <AddToCalendar event={event} />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
