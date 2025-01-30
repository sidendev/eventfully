'use client';

import { formatDate } from '@/lib/utils';
import { Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';

interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    image_url?: string;
}

interface EventCardProps {
    event: Event;
}

export function EventCard({ event }: EventCardProps) {
    return (
        <Link
            href={`/events/${event.id}`}
            className="group block rounded-lg border p-6 hover:border-foreground/10 transition-colors"
        >
            {event.image_url && (
                <div className="aspect-video w-full mb-4 overflow-hidden rounded-md">
                    <img
                        src={event.image_url}
                        alt={event.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
            )}
            <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                {event.title}
            </h3>
            <p className="mt-2 text-muted-foreground line-clamp-2">
                {event.description}
            </p>
            <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{event.location}</span>
                </div>
            </div>
        </Link>
    );
}
