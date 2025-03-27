'use client';

import { useState, useEffect } from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { LineChart, Users, CalendarDays, BarChart } from 'lucide-react';

interface Tab {
    value: string;
    label: string;
    icon: React.ReactElement<{ className?: string }>;
}

const tabs: Tab[] = [
    {
        value: 'overview',
        label: 'Overview',
        icon: <LineChart className="h-4 w-4" />,
    },
    { value: 'tickets', label: 'Tickets', icon: <Users className="h-4 w-4" /> },
    {
        value: 'events',
        label: 'Events',
        icon: <CalendarDays className="h-4 w-4" />,
    },
    { value: 'sales', label: 'Sales', icon: <BarChart className="h-4 w-4" /> },
];

interface ResponsiveTabsProps {
    value: string;
    onValueChange: (value: string) => void;
}

export function ResponsiveTabs({ value, onValueChange }: ResponsiveTabsProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);

        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    if (isMobile) {
        return (
            <Select value={value} onValueChange={onValueChange}>
                <SelectTrigger className="w-full">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {tabs.map((tab) => (
                        <SelectItem key={tab.value} value={tab.value}>
                            <div className="flex items-center gap-2">
                                {tab.icon}
                                {tab.label}
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        );
    }

    return (
        <TabsList className="grid w-full grid-cols-4">
            {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                    <span className="flex items-center gap-2">
                        {tab.icon}
                        {tab.label}
                    </span>
                </TabsTrigger>
            ))}
        </TabsList>
    );
}
