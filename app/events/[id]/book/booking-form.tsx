'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { createBooking } from '@/app/actions/bookings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, MapPin, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { TicketSelector } from '@/components/ticket-selector';

export function BookingForm({ event }: { event: any }) {
    const [quantity, setQuantity] = useState('1');
    const [isLoading, setIsLoading] = useState(false);

    async function handleBooking() {
        try {
            setIsLoading(true);
            const result = await createBooking({
                eventId: event.id,
                quantity: parseInt(quantity),
            });

            if (result?.error) {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error('Failed to create booking');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Link
                href={`/events/${event.id}`}
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
            >
                <ArrowLeft size={16} className="mr-2" />
                Back to event
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Booking Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-4">
                                {event.image_url && (
                                    <img
                                        src={event.image_url}
                                        alt={event.title}
                                        className="w-24 h-24 object-cover rounded-lg"
                                    />
                                )}
                                <div>
                                    <h2 className="text-xl font-semibold">
                                        {event.title}
                                    </h2>
                                    <div className="text-sm text-muted-foreground">
                                        {event.event_types.name}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar size={16} />
                                    <span>{formatDate(event.starts_at)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <MapPin size={16} />
                                    <span>
                                        {event.locations.name},{' '}
                                        {event.locations.city}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <TicketSelector
                        event={event}
                        quantity={quantity}
                        onQuantityChange={setQuantity}
                    />
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span>Ticket Price</span>
                                <span>
                                    {event.is_free
                                        ? 'Free'
                                        : `£${event.ticket_price}`}
                                </span>
                            </div>
                            <div className="flex justify-between items-center font-medium">
                                <span>Total</span>
                                <span>
                                    {event.is_free
                                        ? 'Free'
                                        : `£${(
                                              parseInt(quantity) *
                                              event.ticket_price
                                          ).toFixed(2)}`}
                                </span>
                            </div>
                            <Button
                                onClick={handleBooking}
                                className="w-full"
                                size="lg"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Processing...
                                    </span>
                                ) : event.is_free ? (
                                    'Complete Registration'
                                ) : (
                                    'Proceed to Payment'
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
