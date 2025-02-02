'use client';

import {
    AddToCalendarButton,
    type AddToCalendarButtonType,
} from 'add-to-calendar-button-react';
import { isSameDay, parseISO } from 'date-fns';

interface Event {
    title: string;
    description?: string;
    starts_at: string;
    ends_at: string;
    is_all_day?: boolean;
    locations?: {
        name: string;
        city: string;
        address?: string;
    };
}

interface AddToCalendarProps {
    event: Event;
    className?: string;
}

export function AddToCalendar({ event, className }: AddToCalendarProps) {
    const startDate = parseISO(event.starts_at);
    const endDate = parseISO(event.ends_at);
    const isSingleDay = isSameDay(startDate, endDate);

    // Format location string
    const location = event.locations
        ? `${event.locations.name}${event.locations.address ? `, ${event.locations.address}` : ''}, ${event.locations.city}`
        : '';

    // Common props with correct typing
    const commonProps: Partial<AddToCalendarButtonType> = {
        name: event.title,
        description: event.description,
        location,
        options: ['Google'],
        timeZone: 'Europe/London',
        buttonStyle: 'date',
        lightMode: 'system',
        hideIconButton: true,
        hideCheckmark: true,
        size: '3',
        label: 'Add to Calendar',
        styleLight: `
            --btn-background: hsl(var(--primary));
            --btn-text: hsl(var(--primary-foreground));
            --btn-shadow: transparent;
            --btn-shadow-hover: transparent;
            --btn-shadow-active: transparent;
            --list-background: hsl(var(--background));
            --list-text: hsl(var(--foreground));
            --list-item-hover: hsl(var(--accent));
        `,
    };

    if (event.is_all_day) {
        return (
            <AddToCalendarButton
                {...commonProps}
                startDate={startDate.toISOString().split('T')[0]}
            />
        );
    }

    if (!isSingleDay) {
        // Multi-day event
        const dates = [
            {
                name: event.title,
                description: event.description,
                startDate: startDate.toISOString().split('T')[0],
                startTime: startDate
                    .toISOString()
                    .split('T')[1]
                    .substring(0, 5),
                endDate: endDate.toISOString().split('T')[0],
                endTime: endDate.toISOString().split('T')[1].substring(0, 5),
            },
        ];

        return <AddToCalendarButton {...commonProps} dates={dates} />;
    }

    // Single day event
    return (
        <AddToCalendarButton
            {...commonProps}
            startDate={startDate.toISOString().split('T')[0]}
            startTime={startDate.toISOString().split('T')[1].substring(0, 5)}
            endTime={endDate.toISOString().split('T')[1].substring(0, 5)}
        />
    );
}
