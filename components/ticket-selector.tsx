'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface TicketSelectorProps {
    event: {
        is_free: boolean;
        ticket_price: number;
    };
}

export function TicketSelector({ event }: TicketSelectorProps) {
    const [quantity, setQuantity] = useState('1');
    const maxTickets = 10; // need make this dynamic later based on available tickets

    return (
        <Card>
            <CardHeader>
                <CardTitle>Select Tickets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="quantity">Number of Tickets</Label>
                    <Select value={quantity} onValueChange={setQuantity}>
                        <SelectTrigger id="quantity">
                            <SelectValue placeholder="Select quantity" />
                        </SelectTrigger>
                        <SelectContent>
                            {[...Array(maxTickets)].map((_, i) => (
                                <SelectItem
                                    key={i + 1}
                                    value={(i + 1).toString()}
                                >
                                    {i + 1} {i === 0 ? 'ticket' : 'tickets'} -{' '}
                                    {event.is_free
                                        ? 'Free'
                                        : `£${((i + 1) * event.ticket_price).toFixed(2)}`}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    );
}
