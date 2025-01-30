import { createClient } from '@/utils/supabase/server';
import { Calendar, MapPin, Share2, ArrowLeft } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';

interface EventPageProps {
    params: {
        id: string;
    };
}

export default async function EventPage({ params }: EventPageProps) {
    const supabase = await createClient();

    const { data: event, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', params.id)
        .single();

    if (error || !event) {
        console.error('Error fetching event:', error);
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Link
                href="/events"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
            >
                <ArrowLeft size={16} className="mr-2" />
                Back to events
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {event.image_url && (
                        <div className="aspect-video w-full overflow-hidden rounded-lg">
                            <img
                                src={event.image_url}
                                alt={event.title}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    )}

                    <div>
                        <h1 className="text-4xl font-bold">{event.title}</h1>
                        <div className="mt-4 flex flex-col gap-2 text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                <span>{formatDate(event.date)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin size={16} />
                                <span>{event.location}</span>
                            </div>
                        </div>
                    </div>

                    <div className="prose prose-gray dark:prose-invert max-w-none">
                        <h2 className="text-2xl font-semibold mb-4">
                            About this event
                        </h2>
                        <p className="whitespace-pre-wrap">
                            {event.description}
                        </p>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-8 rounded-lg border p-6 space-y-6">
                        <Button className="w-full" size="lg">
                            Register for Event
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                                navigator
                                    .share({
                                        title: event.title,
                                        text: event.description,
                                        url: window.location.href,
                                    })
                                    .catch(() => {
                                        // Fallback to copying to clipboard
                                        navigator.clipboard.writeText(
                                            window.location.href
                                        );
                                    });
                            }}
                        >
                            <Share2 size={16} className="mr-2" />
                            Share Event
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
