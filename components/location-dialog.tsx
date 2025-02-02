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
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { createLocation } from '@/app/actions/locations';
import { toast } from 'sonner';

interface LocationDialogProps {
    onLocationCreated: () => void;
}

export function LocationDialog({ onLocationCreated }: LocationDialogProps) {
    const [open, setOpen] = useState(false);

    async function handleSubmit(formData: FormData) {
        const result = await createLocation(formData);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success('Location created successfully');
            setOpen(false);
            onLocationCreated();
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="mt-2">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Location
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Location</DialogTitle>
                </DialogHeader>
                <form action={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Venue Name *</Label>
                        <Input id="name" name="name" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Address *</Label>
                        <Input id="address" name="address" required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="city">City *</Label>
                            <Input id="city" name="city" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="state">State/County</Label>
                            <Input id="state" name="state" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="country">Country *</Label>
                            <Input id="country" name="country" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="postal_code">Postal Code</Label>
                            <Input id="postal_code" name="postal_code" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="venue_type">Venue Type</Label>
                        <Input
                            id="venue_type"
                            name="venue_type"
                            placeholder="e.g., Conference Center, Theater, etc."
                        />
                    </div>

                    <Button type="submit" className="w-full">
                        Create Location
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
