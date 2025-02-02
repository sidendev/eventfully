'use client';

import {
    AddToCalendarButton,
    type AddToCalendarButtonType,
} from 'add-to-calendar-button-react';
import { isSameDay, parseISO } from 'date-fns';

export interface Event {
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

export interface AddToCalendarProps {
    event: Event;
    className?: string;
}

const AddToCalendar = ({ event, className }: AddToCalendarProps) => {
    const startDate = parseISO(event.starts_at);
    const endDate = parseISO(event.ends_at);
    const isSingleDay = isSameDay(startDate, endDate);

    const location = event.locations
        ? `${event.locations.name}${event.locations.address ? `, ${event.locations.address}` : ''}, ${event.locations.city}`
        : '';

    const commonProps: Partial<AddToCalendarButtonType> = {
        name: event.title,
        description: event.description,
        location,
        options: [
            'Google',
            'Apple',
            'iCal',
            'Microsoft365',
            'MicrosoftTeams',
            'Outlook.com',
            'Yahoo',
        ],
        timeZone: 'Europe/London',
        buttonStyle: 'round',
        lightMode: 'system',
        hideIconButton: false,
        hideCheckmark: false,
        size: '3',
        label: 'Add to Calendar',
        hideTextLabelButton: false,
        listStyle: 'overlay',
        trigger: 'click',
        hideBranding: true,
        debug: false,
        styleLight: `
            --btn-background: hsl(var(--primary));
            --btn-text: hsl(var(--primary-foreground));
            --btn-shadow: none;
            --btn-shadow-hover: none;
            --btn-shadow-active: none;
            --list-shadow: none;
            --list-background: hsl(var(--background));
            --list-text: hsl(var(--foreground));
            --list-item-hover: hsl(var(--accent));
            --list-background-hover: hsl(var(--accent));
            --list-text-hover: hsl(var(--accent-foreground));
            --font: var(--font-sans);
            --btn-border: 0;
            --btn-radius: 9999px;
            --list-radius: 0.5rem;
            --btn-padding: 8px 16px;
            --z-index: 50;
            --list-z-index: 9999;
            --list-position: fixed; 
        `,
        styleDark: `
            --btn-background: hsl(var(--primary));
            --btn-text: hsl(var(--primary-foreground));
            --btn-shadow: none;
            --btn-shadow-hover: none;
            --btn-shadow-active: none;
            --list-shadow: none;
            --list-background: hsl(var(--background));
            --list-text: hsl(var(--foreground));
            --list-background-hover: hsl(var(--accent));
            --list-text-hover: hsl(var(--accent-foreground));
            --z-index: 50;
            --list-z-index: 9999;
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
};

export default AddToCalendar;
