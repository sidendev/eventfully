'use client';

import { UploadButton } from '@uploadthing/react';
import { OurFileRouter } from '@/app/api/uploadthing/core';
import { useState } from 'react';
import { UserCircle } from 'lucide-react';

interface UploadImageProps {
    onChange?: (url?: string) => void;
    defaultValue?: string;
}

export function UploadImage({ onChange, defaultValue }: UploadImageProps) {
    const [imageUrl, setImageUrl] = useState<string | undefined>(defaultValue);

    return (
        <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden hover:opacity-90 transition-opacity group cursor-pointer">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="Profile"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                ) : (
                    <UserCircle className="w-12 h-12 text-muted-foreground group-hover:scale-105 transition-transform duration-200" />
                )}
            </div>
            <UploadButton<OurFileRouter, 'profileImage'>
                endpoint="profileImage"
                onClientUploadComplete={(res) => {
                    if (res?.[0]) {
                        setImageUrl(res[0].url);
                        onChange?.(res[0].url);
                    }
                }}
                onUploadError={(error: Error) => {
                    console.error(error);
                }}
                className="ut-button:bg-primary ut-button:hover:bg-primary/90 ut-button:transition-colors ut-button:duration-200"
            />
        </div>
    );
}
