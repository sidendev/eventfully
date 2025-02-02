'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
    fullScreen?: boolean;
    text?: string;
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
    ({ className, fullScreen, text, ...props }, ref) => {
        if (fullScreen) {
            return (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
                    ref={ref}
                    {...props}
                >
                    <div className="flex flex-col items-center space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        {text && (
                            <p className="text-sm text-muted-foreground">
                                {text}
                            </p>
                        )}
                    </div>
                </div>
            );
        }

        return (
            <div
                className={cn('flex items-center justify-center', className)}
                ref={ref}
                {...props}
            >
                <Loader2
                    className={cn(
                        'h-4 w-4 animate-spin text-primary',
                        className
                    )}
                />
            </div>
        );
    }
);

LoadingSpinner.displayName = 'LoadingSpinner';

export { LoadingSpinner };
