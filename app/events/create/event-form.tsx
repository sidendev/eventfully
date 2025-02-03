'use client';

import { createEvent, updateEvent } from '@/app/actions/events';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { UploadImage } from '@/components/upload-image';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DateTimePicker } from '@/components/date-time-picker';
import { SubmitButton } from '@/components/submit-button';
import { EventTypeDialog } from '@/components/event-type-dialog';
import { LocationDialog } from '@/components/location-dialog';

interface EventFormProps {
    eventTypes: Array<{ id: string; name: string }>;
    locations: Array<{ id: string; name: string; city: string }>;
    event?: any; // existing event data for edit mode
    mode?: 'create' | 'edit';
}

export function EventForm({
    eventTypes,
    locations,
    event,
    mode = 'create',
}: EventFormProps) {
    const [isFree, setIsFree] = useState(
        event ? event.ticket_price === 0 : true
    );
    const [startDate, setStartDate] = useState<Date | undefined>(
        event ? new Date(event.starts_at) : undefined
    );
    const [endDate, setEndDate] = useState<Date | undefined>(
        event ? new Date(event.ends_at) : undefined
    );

    const action = mode === 'create' ? createEvent : updateEvent;

    // function to refresh locations
    const handleLocationCreated = () => {
        // This should trigger a server refetch of the locations
        window.location.reload();
    };

    // Add this function to refresh event types
    const handleEventTypeCreated = () => {
        // This will trigger a server refetch of the event types
        window.location.reload();
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Link
                href="/organiser"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
            >
                <ArrowLeft size={16} className="mr-2" />
                Back to dashboard
            </Link>

            <div className="max-w-3xl mx-auto">
                <form action={action} className="space-y-8">
                    {mode === 'edit' && (
                        <input type="hidden" name="id" value={event.id} />
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {mode === 'create'
                                    ? 'Create New Event'
                                    : 'Edit Event'}
                            </CardTitle>
                            <CardDescription>
                                {mode === 'create'
                                    ? 'Create a new event for your organisation'
                                    : 'Update your event details'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Event Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    required
                                    defaultValue={event?.title}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="short_description">
                                    Short Description
                                </Label>
                                <Textarea
                                    id="short_description"
                                    name="short_description"
                                    required
                                    defaultValue={event?.short_description}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="full_description">
                                    Full Description
                                </Label>
                                <Textarea
                                    id="full_description"
                                    name="full_description"
                                    required
                                    className="min-h-[200px]"
                                    defaultValue={event?.full_description}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Event Image</Label>
                                <UploadImage
                                    endpoint="eventImage"
                                    name="image_url"
                                    defaultValue={event?.image_url}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="type">Event Type</Label>
                                    <Select
                                        name="type_id"
                                        defaultValue={event?.type_id}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {eventTypes.map((type) => (
                                                <SelectItem
                                                    key={type.id}
                                                    value={type.id}
                                                >
                                                    {type.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <EventTypeDialog
                                        onEventTypeCreated={
                                            handleEventTypeCreated
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Select
                                        name="location_id"
                                        defaultValue={event?.location_id}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select location" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {locations.map((location) => (
                                                <SelectItem
                                                    key={location.id}
                                                    value={location.id}
                                                >
                                                    {location.name},{' '}
                                                    {location.city}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <LocationDialog
                                        onLocationCreated={
                                            handleLocationCreated
                                        }
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Start Date & Time</Label>
                                    <DateTimePicker
                                        name="starts_at"
                                        date={startDate}
                                        setDate={setStartDate}
                                        label="Start Date & Time"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>End Date & Time</Label>
                                    <DateTimePicker
                                        name="ends_at"
                                        date={endDate}
                                        setDate={setEndDate}
                                        label="End Date & Time"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="is_free"
                                        name="is_free"
                                        checked={isFree}
                                        onChange={(e) =>
                                            setIsFree(e.target.checked)
                                        }
                                        className="form-checkbox"
                                    />
                                    <Label htmlFor="is_free">
                                        This is a free event
                                    </Label>
                                </div>

                                {!isFree && (
                                    <div className="space-y-2">
                                        <Label htmlFor="ticket_price">
                                            Ticket Price (£)
                                        </Label>
                                        <Input
                                            id="ticket_price"
                                            name="ticket_price"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            defaultValue={
                                                event?.ticket_price || ''
                                            }
                                            required
                                        />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="max_attendees">
                                        Maximum Attendees (Optional)
                                    </Label>
                                    <Input
                                        id="max_attendees"
                                        name="max_attendees"
                                        type="number"
                                        min="1"
                                        defaultValue={
                                            event?.max_attendees || ''
                                        }
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <SubmitButton>
                            {mode === 'create'
                                ? 'Create Event'
                                : 'Save Changes'}
                        </SubmitButton>
                    </div>
                </form>
            </div>
        </div>
    );
}
