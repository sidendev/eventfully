import { createClient } from '@/utils/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Calendar,
    MapPin,
    Ticket,
    ArrowLeft,
    CalendarPlus,
} from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { AddToCalendar } from '@/components/ui/add-to-calendar-wrapper';

export default async function BookingSuccessPage({
    params,
    searchParams,
}: {
    params: { id: string };
    searchParams: { booking: string };
}) {
    console.log('Success page params:', params);
    console.log('Success page searchParams:', searchParams);

    const supabase = await createClient();

    // Getting booking with related data
    const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .select(
            `
            *,
            event:events (
                *,
                locations (*),
                event_types (*),
                organiser_profiles (*)
            ),
            tickets (*)
        `
        )
        .eq('id', searchParams.booking)
        .single();

    if (bookingError) {
        console.error('Error fetching booking:', bookingError);
        notFound();
    }

    if (!booking) {
        console.error('No booking found');
        notFound();
    }

    // Making sure the user can only view own bookings
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user || booking.user_id !== user.id) {
        redirect('/');
    }

    const event = booking.event;

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <Link
                    href="/"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Back to events
                </Link>

                <Card className="max-w-2xl mx-auto">
                    <CardHeader className="text-center border-b">
                        <div className="flex justify-center mb-4">
                            <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                <Ticket className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl mb-2">
                            Booking Confirmed!
                        </CardTitle>
                        <p className="text-muted-foreground">
                            Your event tickets have been booked successfully
                        </p>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-8">
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-lg mb-2">
                                    {event.title}
                                </h3>
                                <div className="text-sm text-muted-foreground">
                                    {event.event_types.name}
                                </div>
                            </div>

                            <div className="space-y-3">
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

                            <div className="border rounded-lg p-4 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span>Number of Tickets</span>
                                    <span>{booking.tickets.length}</span>
                                </div>
                                <div className="flex justify-between font-medium">
                                    <span>Total Amount</span>
                                    <span>
                                        {booking.total_amount === 0
                                            ? 'Free'
                                            : `£${booking.total_amount.toFixed(2)}`}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button asChild>
                                <Link href="/my-events">View My Events</Link>
                            </Button>
                            <AddToCalendar event={event} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
