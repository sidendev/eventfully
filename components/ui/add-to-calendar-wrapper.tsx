'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Dynamically import the AddToCalendar component with no SSR to avoid mismatch server with client
const AddToCalendar = dynamic(() => import('./add-to-calendar'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-10">
            <Loader2 className="h-4 w-4 animate-spin" />
        </div>
    ),
});

export { AddToCalendar };
