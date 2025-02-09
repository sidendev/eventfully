'use client';

import * as React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface DateTimePickerProps {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
    label: string;
    name: string;
    required?: boolean;
}

export function DateTimePicker({
    date,
    setDate,
    label,
    name,
    required = false,
}: DateTimePickerProps) {
    const [selectedTime, setSelectedTime] = React.useState(
        date ? format(date, 'HH:mm') : ''
    );

    const handleDateSelect = (newDate: Date | undefined) => {
        if (newDate && date) {
            const hours = date.getHours();
            const minutes = date.getMinutes();
            newDate.setHours(hours, minutes, 0, 0);
        }
        setDate(newDate);
    };

    const handleTimeChange = (time: string) => {
        setSelectedTime(time);
        if (date) {
            const [hours, minutes] = time.split(':');
            const newDate = new Date(date);
            newDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            setDate(newDate);
        }
    };

    React.useEffect(() => {
        if (date && !selectedTime) {
            setSelectedTime(format(date, 'HH:mm'));
        }
    }, [date]);

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <div className="flex gap-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                'w-[240px] justify-start text-left font-normal',
                                !date && 'text-muted-foreground'
                            )}
                            type="button"
                            aria-required={required}
                            aria-invalid={required && !date}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? (
                                format(date, 'PPP')
                            ) : (
                                <span>Pick a date</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleDateSelect}
                            initialFocus
                            required={required}
                        />
                    </PopoverContent>
                </Popover>
                <Input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => handleTimeChange(e.target.value)}
                    className="w-[140px]"
                    required={required}
                />
                <input
                    type="hidden"
                    name={name}
                    value={date?.toISOString() || ''}
                    required={required}
                />
            </div>
        </div>
    );
}
