'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { encodedRedirect } from '@/utils/utils';

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
        const is_free = formData.get('is_free') === 'true';
        const ticket_price = formData.get('ticket_price') as string;
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
            ticket_price: is_free ? 0 : parseFloat(ticket_price),
            is_published: true,
            starts_at: startDate.toISOString(),
            ends_at: endDate.toISOString(),
        });

        if (createError) {
            console.error('Create event error:', createError);
            return encodedRedirect(
                'error',
                '/events/create',
                'Failed to create event'
            );
        }

        revalidatePath('/events');
        return encodedRedirect(
            'success',
            '/organiser',
            'Event created successfully'
        );
    } catch (error) {
        console.error('Event creation error:', error);
        return encodedRedirect(
            'error',
            '/events/create',
            'Failed to create event'
        );
    }
}
