'use client';

import { updateEvent } from '@/app/actions/events';
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
import Link from 'next/link'; // Changed from react-router-dom
import { useState } from 'react';
import { DateTimePicker } from '@/components/date-time-picker';
import { SubmitButton } from '@/components/submit-button';
import { EventTypeDialog } from '@/components/event-type-dialog';
import { LocationDialog } from '@/components/location-dialog';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

interface EditEventFormProps {
    eventTypes: Array<{ id: string; name: string }>;
    locations: Array<{ id: string; name: string; city: string }>;
    event: any; // TODO: Add proper type
}

export function EditEventForm({
    eventTypes,
    locations,
    event,
}: EditEventFormProps) {
    // TODO: Re-enable price settings when Stripe integration is complete
    // const [isFree, setIsFree] = useState(event.ticket_price === 0);
    const [startDate, setStartDate] = useState<Date | undefined>(
        event.starts_at ? new Date(event.starts_at) : undefined
    );
    const [endDate, setEndDate] = useState<Date | undefined>(
        event.ends_at ? new Date(event.ends_at) : undefined
    );

    // function to refresh locations
    const handleLocationCreated = () => {
        window.location.reload();
    };

    // Add this function to refresh event types
    const handleEventTypeCreated = () => {
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
                <form action={updateEvent} className="space-y-8">
                    <input type="hidden" name="id" value={event.id} />
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Event</CardTitle>
                            <CardDescription>
                                Update your event details
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Event Title</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        required
                                        defaultValue={event.title}
                                        placeholder="Enter event title"
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
                                        defaultValue={event.short_description}
                                        placeholder="Brief description for event listings"
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
                                        defaultValue={event.full_description}
                                        placeholder="Detailed event description"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Event Image</Label>
                                    <UploadImage
                                        name="image_url"
                                        defaultValue={event.image_url}
                                        endpoint="eventImage"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="type">Event Type</Label>
                                        <EventTypeDialog
                                            onEventTypeCreated={
                                                handleEventTypeCreated
                                            }
                                        />
                                    </div>
                                    <Select
                                        name="type_id"
                                        defaultValue={event.type_id}
                                        required
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
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="location">
                                            Location
                                        </Label>
                                        <LocationDialog
                                            onLocationCreated={
                                                handleLocationCreated
                                            }
                                        />
                                    </div>
                                    <Select
                                        name="location_id"
                                        defaultValue={event.location_id}
                                        required
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
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Start Date & Time</Label>
                                    <DateTimePicker
                                        name="starts_at"
                                        date={startDate}
                                        setDate={(date: Date | undefined) =>
                                            setStartDate(date)
                                        }
                                        label="Start Date & Time"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>End Date & Time</Label>
                                    <DateTimePicker
                                        name="ends_at"
                                        date={endDate}
                                        setDate={(date: Date | undefined) =>
                                            setEndDate(date)
                                        }
                                        label="End Date & Time"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="is_free"
                                        name="is_free"
                                        checked={true}
                                        disabled
                                        className="cursor-not-allowed"
                                    />
                                    <Label htmlFor="is_free">
                                        This is a free event
                                    </Label>
                                    <Badge variant="secondary" className="ml-2">
                                        All events are free during beta
                                    </Badge>
                                </div>

                                <input
                                    type="hidden"
                                    name="ticket_price"
                                    value="0"
                                />

                                {/* TODO: Re-enable when Stripe integration is complete
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
                                            defaultValue={event.ticket_price}
                                            required
                                        />
                                    </div>
                                )}
                                */}

                                <div className="space-y-2">
                                    <Label htmlFor="max_attendees">
                                        Maximum Attendees (Optional)
                                    </Label>
                                    <Input
                                        id="max_attendees"
                                        name="max_attendees"
                                        type="number"
                                        min="1"
                                        defaultValue={event.max_attendees || ''}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <SubmitButton>Save Changes</SubmitButton>
                    </div>
                </form>
            </div>
        </div>
    );
}
