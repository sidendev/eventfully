'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { UploadImage } from '@/components/upload-image';
import { createEvent } from '@/app/actions/events';
import { SubmitButton } from '@/components/submit-button';
import { DateTimePicker } from '@/components/date-time-picker';
import { useState } from 'react';
import { useEventForm } from '@/components/event-form';
import { cn } from '@/lib/utils';
import { LocationDialog } from '@/components/location-dialog';

interface EventFormProps {
    eventTypes: { id: string; name: string }[];
    locations: { id: string; name: string; city: string }[];
}

export function EventForm({ eventTypes, locations }: EventFormProps) {
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [isFreeEvent, setIsFreeEvent] = useState(false);
    const [ticketPrice, setTicketPrice] = useState<string>('');

    // Handling free event toggle
    const handleFreeEventToggle = (checked: boolean) => {
        setIsFreeEvent(checked);
        if (checked) {
            setTicketPrice('0');
        } else {
            setTicketPrice('');
        }
    };

    // function to refresh locations
    const handleLocationCreated = () => {
        // This should trigger a server refetch of the locations
        window.location.reload();
    };

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold">Create Event</h1>
                            <p className="text-muted-foreground mt-2">
                                Fill in the details below to create your event.
                            </p>
                        </div>

                        <form action={createEvent} className="space-y-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Basic Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="title">
                                                Event Title
                                            </Label>
                                            <Input
                                                id="title"
                                                name="title"
                                                placeholder="Give your event a name"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="short_description">
                                                Short Description
                                            </Label>
                                            <Textarea
                                                id="short_description"
                                                name="short_description"
                                                placeholder="Brief overview of your event"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="full_description">
                                                Full Description
                                            </Label>
                                            <Textarea
                                                id="full_description"
                                                name="full_description"
                                                placeholder="Detailed description of your event"
                                                className="h-32"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Event Image</Label>
                                            <UploadImage
                                                name="image_url"
                                                endpoint="eventImage"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Event Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="type">
                                                Event Type
                                            </Label>
                                            <Select name="type_id" required>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select event type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {eventTypes?.map((type) => (
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
                                            <Label htmlFor="location">
                                                Location
                                            </Label>
                                            <Select name="location_id" required>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select location" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {locations?.map(
                                                        (location) => (
                                                            <SelectItem
                                                                key={
                                                                    location.id
                                                                }
                                                                value={
                                                                    location.id
                                                                }
                                                            >
                                                                {location.name},{' '}
                                                                {location.city}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <LocationDialog
                                                onLocationCreated={
                                                    handleLocationCreated
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="max_attendees">
                                            Maximum Attendees
                                        </Label>
                                        <Input
                                            id="max_attendees"
                                            name="max_attendees"
                                            type="number"
                                            min="1"
                                            placeholder="Leave empty for unlimited"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <DateTimePicker
                                            date={startDate}
                                            setDate={setStartDate}
                                            label="Start Date and Time"
                                            name="starts_at"
                                        />
                                        <DateTimePicker
                                            date={endDate}
                                            setDate={setEndDate}
                                            label="End Date and Time"
                                            name="ends_at"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Ticket Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="is_free"
                                            name="is_free"
                                            checked={isFreeEvent}
                                            onCheckedChange={
                                                handleFreeEventToggle
                                            }
                                        />
                                        <Label htmlFor="is_free">
                                            This is a free event
                                        </Label>
                                    </div>

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
                                            placeholder="0.00"
                                            disabled={isFreeEvent}
                                            value={ticketPrice}
                                            onChange={(e) =>
                                                setTicketPrice(e.target.value)
                                            }
                                            className={cn(
                                                isFreeEvent &&
                                                    'bg-muted opacity-50'
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex justify-end">
                                <SubmitButton>Publish Event</SubmitButton>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
