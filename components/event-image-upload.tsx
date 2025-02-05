'use client';

import { UploadButton } from '@uploadthing/react';
import { OurFileRouter } from '@/app/api/uploadthing/core';
import { useState } from 'react';
import { Building2 } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface EventImageUploadProps {
    onChange?: (url?: string) => void;
    defaultValue?: string;
    name: string;
}

export function EventImageUpload({
    onChange,
    defaultValue,
    name,
}: EventImageUploadProps) {
    const [fileUrl, setFileUrl] = useState<string>('');

    return (
        <div className="flex items-center gap-4">
            {!fileUrl && !defaultValue && (
                <div className="w-40 aspect-video bg-muted flex items-center justify-center rounded-md border border-dashed hover:opacity-90 transition-opacity">
                    <Building2 className="h-8 w-8 text-muted-foreground" />
                </div>
            )}

            {(fileUrl || defaultValue) && (
                <div className="relative w-40 aspect-video rounded-md overflow-hidden">
                    <Image
                        src={fileUrl || defaultValue || ''}
                        alt="Event image"
                        className="object-cover"
                        fill
                        sizes="160px"
                    />
                </div>
            )}

            <input
                type="hidden"
                name={name}
                value={fileUrl || defaultValue || ''}
            />

            <UploadButton<OurFileRouter, 'eventImage'>
                endpoint="eventImage"
                onClientUploadComplete={(res) => {
                    if (res?.[0]?.url) {
                        setFileUrl(res[0].url);
                        onChange?.(res[0].url);
                        toast.success('Image uploaded successfully');
                    }
                }}
                onUploadError={(error: Error) => {
                    toast.error(`Error uploading image: ${error.message}`);
                }}
            />
        </div>
    );
}
