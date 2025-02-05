'use client';

import { createEvent } from '@/app/actions/events';
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
import { EventImageUpload } from '@/components/event-image-upload';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { DateTimePicker } from '@/components/date-time-picker';
import { SubmitButton } from '@/components/submit-button';
import { EventTypeDialog } from '@/components/event-type-dialog';
import { LocationDialog } from '@/components/location-dialog';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

interface CreateEventFormProps {
    eventTypes: Array<{ id: string; name: string }>;
    locations: Array<{ id: string; name: string; city: string }>;
}

export function CreateEventForm({
    eventTypes,
    locations,
}: CreateEventFormProps) {
    const [isFree] = useState(true);
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);

    // function to refresh locations to be fixed
    const handleLocationCreated = () => {
        window.location.reload();
    };

    // Add this function to refresh event types to be fixed
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
                <form action={createEvent} className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create New Event</CardTitle>
                            <CardDescription>
                                Organiser Profile is required to be set up
                                before you can create an event.
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
                                        placeholder="Brief description for event listings page"
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
                                        placeholder="Detailed event description for your event page"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Event Image</Label>
                                    <EventImageUpload name="image_url" />
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
                                    <Select name="type_id" required>
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
                                    <Select name="location_id" required>
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
                                    <DateTimePicker
                                        name="starts_at"
                                        date={startDate}
                                        setDate={setStartDate}
                                        label="Start Date & Time"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <DateTimePicker
                                        name="ends_at"
                                        date={endDate}
                                        setDate={setEndDate}
                                        label="End Date & Time"
                                        required
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

                                <div className="space-y-2">
                                    <Label htmlFor="max_attendees">
                                        Number of tickets available
                                    </Label>
                                    <Input
                                        id="max_attendees"
                                        name="max_attendees"
                                        type="number"
                                        min="1"
                                        required
                                        placeholder="Enter number of available tickets"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <SubmitButton>Create Event</SubmitButton>
                    </div>
                </form>
            </div>
        </div>
    );
}
