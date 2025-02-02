'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { encodedRedirect } from '@/utils/utils';

interface CreateBookingData {
    eventId: string;
    quantity: number;
}

interface BookingResult {
    error?: string;
    redirect?: string;
    message?: string;
}

export async function createBooking({
    eventId,
    quantity,
}: CreateBookingData): Promise<BookingResult | void> {
    try {
        const supabase = await createClient();

        // Getting the user
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
            console.error('User not authenticated');
            return { error: 'Not authenticated' };
        }

        const { data: event, error: eventError } = await supabase
            .from('events')
            .select('*')
            .eq('id', eventId)
            .single();

        if (eventError) {
            console.error('Event fetch error:', eventError);
            return { error: 'Failed to fetch event details' };
        }

        if (!event) {
            console.error('Event not found');
            return { error: 'Event not found' };
        }

        // Check if there are enough tickets available
        if (event.max_attendees !== null && event.max_attendees < quantity) {
            return {
                error: 'Not enough tickets available',
            };
        }

        // For handling free events (price is null or 0)
        if (!event.ticket_price || event.ticket_price === 0) {
            console.log('Processing free event booking...');

            // Create booking first
            const { data: booking, error: bookingError } = await supabase
                .from('bookings')
                .insert({
                    user_id: user.id,
                    event_id: eventId,
                    status: 'confirmed',
                    ticket_quantity: quantity,
                    total_amount: 0,
                })
                .select()
                .single();

            if (bookingError) {
                console.error('Booking creation error:', bookingError);
                return { error: 'Failed to create booking' };
            }

            console.log('Booking created successfully:', booking);

            const tickets = Array.from({ length: quantity }, () => ({
                booking_id: booking.id,
                event_id: eventId,
                user_id: user.id,
                ticket_number: crypto.randomUUID(),
                is_scanned: false,
            }));

            const { error: ticketsError } = await supabase
                .from('tickets')
                .insert(tickets);

            if (ticketsError) {
                console.error('Tickets creation error:', ticketsError);
                await supabase.from('bookings').delete().eq('id', booking.id);
                return { error: 'Failed to create tickets' };
            }

            console.log('Tickets created successfully');

            // Updating max_attendees if it's not null
            if (event.max_attendees !== null) {
                const { error: updateError } = await supabase
                    .from('events')
                    .update({ max_attendees: event.max_attendees - quantity })
                    .eq('id', eventId);

                if (updateError) {
                    console.error('Error updating max_attendees:', updateError);
                    throw updateError;
                }
            }

            console.log('Redirecting to success page...');
            const redirectUrl = `/events/${eventId}/book/success?booking=${booking.id}`;
            console.log('Redirect URL:', redirectUrl);

            return {
                redirect: redirectUrl,
                message: 'Registration successful!',
            };
        }

        // For paid events - this will be handled by Stripe later
        const { data: pendingBooking, error: pendingBookingError } =
            await supabase
                .from('bookings')
                .insert({
                    user_id: user.id,
                    event_id: eventId,
                    status: 'pending',
                    ticket_quantity: quantity,
                    total_amount: event.ticket_price * quantity,
                })
                .select()
                .single();

        if (pendingBookingError) throw pendingBookingError;

        return encodedRedirect(
            'success',
            `/events/${eventId}/book/payment?booking=${pendingBooking.id}`,
            'Proceeding to payment'
        );
    } catch (error) {
        console.error('Detailed booking error:', error);
        return {
            error: 'Failed to create booking',
        };
    }
}
