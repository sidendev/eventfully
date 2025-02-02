import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, MapPin, Ticket } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { TicketSelector } from '@/components/ticket-selector';

interface BookingPageProps {
    params: {
        id: string;
    };
}

export default async function BookingPage({ params }: BookingPageProps) {
    const supabase = await createClient();

    const { data: event, error } = await supabase
        .from('events')
        .select(
            `
            *,
            locations (*),
            event_types (*),
            organiser_profiles (*)
        `
        )
        .eq('id', params.id)
        .single();

    if (error || !event) {
        console.error('Error fetching event:', error);
        notFound();
    }

    return (
        <div className="min-h-screen bg-background">
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
                                        <span>
                                            {formatDate(event.starts_at)}
                                        </span>
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

                        <TicketSelector event={event} />
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
                                            : `£${event.ticket_price}`}
                                    </span>
                                </div>
                                <Button className="w-full" size="lg">
                                    {event.is_free
                                        ? 'Complete Registration'
                                        : 'Proceed to Payment'}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
