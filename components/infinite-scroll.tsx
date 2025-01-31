'use client';

import { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { useRouter, useSearchParams } from 'next/navigation';

interface InfiniteScrollProps {
    children: React.ReactNode;
    hasMore: boolean;
    currentPage: number;
    itemCount: number;
}

export function InfiniteScroll({
    children,
    hasMore,
    currentPage,
    itemCount,
}: InfiniteScrollProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { ref, inView } = useInView();
    const prevItemCount = useRef(itemCount);

    useEffect(() => {
        if (inView && hasMore) {
            const params = new URLSearchParams(searchParams.toString());
            params.set('page', (currentPage + 1).toString());
            router.push(`/?${params.toString()}`, { scroll: false });
        }
    }, [inView, hasMore, currentPage, router, searchParams]);

    // Reset page when filters change
    useEffect(() => {
        if (prevItemCount.current !== itemCount) {
            prevItemCount.current = itemCount;
            const params = new URLSearchParams(searchParams.toString());
            params.delete('page');
            router.push(`/?${params.toString()}`, { scroll: false });
        }
    }, [itemCount, router, searchParams]);

    return (
        <>
            {children}
            {hasMore && (
                <div
                    ref={ref}
                    className="h-10 flex items-center justify-center"
                >
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                </div>
            )}
        </>
    );
}
