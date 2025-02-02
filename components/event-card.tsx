'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Calendar, MapPin } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { Button } from './ui/button';

interface EventCardProps {
    event: {
        id: string;
        title: string;
        short_description: string;
        image_url: string | null;
        starts_at: string;
        locations: {
            name: string;
            city: string;
        } | null;
        event_types: {
            name: string;
        } | null;
        organiser_profiles: {
            name: string;
        } | null;
    };
}

export function EventCard({ event }: EventCardProps) {
    return (
        <Link href={`/events/${event.id}`} className="block">
            <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                {event.image_url && (
                    <div className="aspect-video w-full overflow-hidden">
                        <img
                            src={event.image_url}
                            alt={event.title}
                            className="object-cover w-full h-full"
                        />
                    </div>
                )}
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <div>
                            <div className="text-sm text-muted-foreground">
                                {event.event_types?.name}
                            </div>
                            <h3 className="font-semibold text-xl mt-1 line-clamp-2">
                                {event.title}
                            </h3>
                            <p className="text-muted-foreground mt-2 line-clamp-2">
                                {event.short_description}
                            </p>
                        </div>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                <span>{formatDate(event.starts_at)}</span>
                            </div>
                            {event.locations && (
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} />
                                    <span>
                                        {event.locations.name},{' '}
                                        {event.locations.city}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                    <Button variant="secondary" className="w-full">
                        View Details
                    </Button>
                </CardFooter>
            </Card>
        </Link>
    );
}
