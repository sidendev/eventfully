'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { createEventType } from '@/app/actions/event-types';
import { toast } from 'sonner';

interface EventTypeDialogProps {
    onEventTypeCreated: () => void;
}

export function EventTypeDialog({ onEventTypeCreated }: EventTypeDialogProps) {
    const [open, setOpen] = useState(false);

    async function handleSubmit(formData: FormData) {
        const result = await createEventType(formData);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success('Event type created successfully');
            setOpen(false);
            onEventTypeCreated();
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="mt-2">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Event Type
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Event Type</DialogTitle>
                </DialogHeader>
                <form action={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Event Type Name *</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="e.g., Conference, Workshop, Concert"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Describe this type of event..."
                        />
                    </div>

                    <Button type="submit" className="w-full">
                        Create Event Type
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
