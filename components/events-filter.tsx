'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { createClient } from '@/utils/supabase/client';

export function EventsFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [eventTypes, setEventTypes] = useState<
        Array<{ id: string; name: string }>
    >([]);

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set(name, value);
            } else {
                params.delete(name);
            }
            return params.toString();
        },
        [searchParams]
    );

    const handleSearch = useDebouncedCallback((term: string) => {
        router.push(`/?${createQueryString('search', term)}`, {
            scroll: false,
        });
    }, 300);

    const handleFilter = (name: string, value: string) => {
        router.push(
            `/?${createQueryString(name, value === 'all' ? '' : value)}`,
            { scroll: false }
        );
    };

    useEffect(() => {
        async function fetchEventTypes() {
            const supabase = createClient();
            const { data } = await supabase
                .from('event_types')
                .select('id, name');
            if (data) setEventTypes(data);
        }
        fetchEventTypes();
    }, []);

    return (
        <div className="w-full space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                        size={18}
                    />
                    <Input
                        placeholder="Search events..."
                        className="pl-10"
                        onChange={(e) => handleSearch(e.target.value)}
                        defaultValue={searchParams.get('search') ?? ''}
                    />
                </div>
                <Select
                    defaultValue={searchParams.get('type') ?? 'all'}
                    onValueChange={(value) => handleFilter('type', value)}
                >
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Event Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {eventTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                                {type.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select
                    defaultValue={searchParams.get('sort') ?? 'soonest'}
                    onValueChange={(value) => handleFilter('sort', value)}
                >
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="soonest">Soonest</SelectItem>
                        <SelectItem value="latest">Latest</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
