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
}

export async function createBooking({
    eventId,
    quantity,
}: CreateBookingData): Promise<BookingResult | void> {
    try {
        const supabase = await createClient();

        // Getting the authenticated user
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();
        if (!user) {
            return encodedRedirect(
                'error',
                '/sign-in',
                'Please sign in to book tickets'
            );
        }

        // Getting the event details
        const { data: event, error: eventError } = await supabase
            .from('events')
            .select('*')
            .eq('id', eventId)
            .single();

        if (eventError || !event) {
            throw new Error('Event not found');
        }

        // Starting a transaction by creating the booking
        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .insert({
                user_id: user.id,
                event_id: eventId,
                status: event.is_free ? 'confirmed' : 'pending',
                total_amount: event.is_free ? 0 : event.ticket_price * quantity,
            })
            .select()
            .single();

        if (bookingError) throw bookingError;

        // Creating tickets for the booking
        const tickets = Array(quantity).fill({
            booking_id: booking.id,
            event_id: eventId,
            user_id: user.id,
            status: event.is_free ? 'valid' : 'pending',
        });

        const { error: ticketsError } = await supabase
            .from('tickets')
            .insert(tickets);

        if (ticketsError) throw ticketsError;

        // Handling free events
        if (event.is_free) {
            revalidatePath(`/events/${eventId}`);
            return encodedRedirect(
                'success',
                `/events/${eventId}`,
                'Registration successful!'
            );
        }

        // For paid events we then process to payment process
        return encodedRedirect(
            'success',
            `/events/${eventId}/book/payment`,
            'Proceeding to payment'
        );
    } catch (error) {
        console.error('Booking error:', error);
        return encodedRedirect(
            'error',
            `/events/${eventId}/book`,
            'Failed to create booking'
        );
    }
}
