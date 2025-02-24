'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { encodedRedirect } from '@/utils/utils';
import { redirect } from 'next/navigation';

export async function createEvent(formData: FormData) {
    try {
        const supabase = await createClient();

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return encodedRedirect('error', '/sign-in', 'Not authenticated');
        }

        // Getting the organiser profile id
        const { data: organiserProfile } = await supabase
            .from('organiser_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (!organiserProfile) {
            return encodedRedirect(
                'error',
                '/organiser',
                'Please complete your organiser profile first'
            );
        }

        // Getting the form data
        const title = formData.get('title') as string;
        const short_description = formData.get('short_description') as string;
        const full_description = formData.get('full_description') as string;
        const image_url = formData.get('image_url') as string;
        const type_id = formData.get('type_id') as string;
        const location_id = formData.get('location_id') as string;
        const max_attendees = formData.get('max_attendees') as string;

        // TODO: Temporarily force all events to be free during beta
        // This will be updated when Stripe integration is implemented
        const is_free = true;
        const ticket_price = 0;
        const starts_at = formData.get('starts_at') as string;
        const ends_at = formData.get('ends_at') as string;

        // Validation checks
        if (
            !title ||
            !short_description ||
            !full_description ||
            !starts_at ||
            !ends_at
        ) {
            return encodedRedirect(
                'error',
                '/events/create',
                'Please fill in all required fields and select start and end dates'
            );
        }

        const startDate = new Date(starts_at);
        const endDate = new Date(ends_at);

        if (startDate >= endDate) {
            return encodedRedirect(
                'error',
                '/events/create',
                'End date must be after start date'
            );
        }

        // Creating a slug from title
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        // Checking if slug already exists
        const { data: existingSlug } = await supabase
            .from('events')
            .select('id')
            .eq('slug', slug)
            .single();

        if (existingSlug) {
            return encodedRedirect(
                'error',
                '/events/create',
                'An event with a similar title already exists'
            );
        }

        // Inserting the event
        const { error: createError } = await supabase.from('events').insert({
            title,
            slug,
            short_description,
            full_description,
            image_url,
            type_id,
            location_id,
            max_attendees: max_attendees ? parseInt(max_attendees) : null,
            organiser_profile_id: organiserProfile.id,
            ticket_price: 0, // Force free during beta
            is_published: true,
            starts_at: startDate.toISOString(),
            ends_at: endDate.toISOString(),
        });

        if (createError) {
            console.error('Create event error:', createError);
            return { type: 'error', message: 'Failed to create event' };
        }

        console.log('Event created successfully');
        revalidatePath('/organiser');

        return { type: 'success', message: 'Event created successfully' };
    } catch (error) {
        console.error('Event creation error:', error);
        return { type: 'error', message: 'Failed to create event' };
    }
}

export async function deleteEvent(eventId: string) {
    const supabase = await createClient();

    try {
        // Check if user is authorized
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
            throw new Error('Unauthorized');
        }

        // Get user's organiser profile
        const { data: organiserProfile, error: profileError } = await supabase
            .from('organiser_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (profileError) {
            console.error('Profile error:', profileError);
            throw new Error('Failed to get organiser profile');
        }

        if (!organiserProfile) {
            throw new Error('Organiser profile not found');
        }

        // Verify the event belongs to this organiser
        const { data: event, error: eventError } = await supabase
            .from('events')
            .select('organiser_profile_id')
            .eq('id', eventId)
            .single();

        if (eventError) {
            console.error('Event error:', eventError);
            throw new Error('Failed to get event');
        }

        if (!event || event.organiser_profile_id !== organiserProfile.id) {
            throw new Error('Unauthorized: Event not found or access denied');
        }

        // Start a transaction to delete event and related data
        const { error: deleteError } = await supabase.rpc('delete_event', {
            event_id: eventId,
            user_id: user.id,
        });

        if (deleteError) {
            console.error('Delete error:', deleteError);
            throw new Error(`Failed to delete event: ${deleteError.message}`);
        }

        // Revalidate the organiser page
        revalidatePath('/organiser');
    } catch (error) {
        console.error('Delete event error:', error);
        throw error;
    }
}

export async function cancelEvent(eventId: string) {
    const supabase = await createClient();

    try {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
            throw new Error('Unauthorized');
        }

        const { error: cancelError } = await supabase.rpc('cancel_event', {
            event_id: eventId,
            user_id: user.id,
        });

        if (cancelError) {
            console.error('Cancel error:', cancelError);
            throw new Error(`Failed to cancel event: ${cancelError.message}`);
        }

        revalidatePath('/organiser');
    } catch (error) {
        console.error('Cancel event error:', error);
        throw error;
    }
}

export async function updateEvent(formData: FormData) {
    try {
        const supabase = await createClient();

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return encodedRedirect('error', '/sign-in', 'Not authenticated');
        }

        // Getting form data
        const eventId = formData.get('id') as string;
        const title = formData.get('title') as string;
        const short_description = formData.get('short_description') as string;
        const full_description = formData.get('full_description') as string;
        const image_url = formData.get('image_url') as string;
        const type_id = formData.get('type_id') as string;
        const location_id = formData.get('location_id') as string;
        const max_attendees = formData.get('max_attendees') as string;
        const is_free = true;
        const ticket_price = 0;
        const starts_at = formData.get('starts_at') as string;
        const ends_at = formData.get('ends_at') as string;

        console.log('Received dates:', { starts_at, ends_at });

        if (!starts_at || !ends_at) {
            return {
                type: 'error',
                message: 'Start and end dates are required',
            };
        }

        const startDate = new Date(starts_at);
        const endDate = new Date(ends_at);

        console.log('Parsed dates:', {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
        });

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return { type: 'error', message: 'Invalid date format' };
        }

        // Validation checks
        if (
            !title ||
            !short_description ||
            !full_description ||
            !starts_at ||
            !ends_at
        ) {
            return encodedRedirect(
                'error',
                `/events/${eventId}/edit`,
                'Please fill in all required fields'
            );
        }

        if (startDate >= endDate) {
            return encodedRedirect(
                'error',
                `/events/${eventId}/edit`,
                'End date must be after start date'
            );
        }

        // Update the event using RPC function
        const { error: updateError } = await supabase.rpc('update_event', {
            event_id: eventId,
            user_id: user.id,
            title,
            short_description,
            full_description,
            image_url,
            type_id,
            location_id,
            max_attendees: max_attendees ? parseInt(max_attendees) : null,
            ticket_price: 0, // Force free during beta
            starts_at: startDate.toISOString(),
            ends_at: endDate.toISOString(),
        });

        if (updateError) {
            console.error('Update error:', updateError);
            return { type: 'error', message: updateError.message };
        }

        revalidatePath('/organiser');
        return { type: 'success', message: 'Event updated successfully' };
    } catch (error) {
        console.error('Event update error:', error);
        return { type: 'error', message: 'Failed to update event' };
    }
}
