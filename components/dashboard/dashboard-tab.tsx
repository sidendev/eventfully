'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { ResponsiveTabs } from './responsive-tabs';
import { CalendarDays, Users, BarChart } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { eventColumns, EventData } from './columns';
import { ticketColumns, type TicketData } from './columns/ticket-columns';
import {
    financialColumns,
    type FinancialData,
} from './columns/financial-columns';
import { OverviewTab } from './overview-tab';

interface DashboardTabProps {
    organiserProfile: any;
    events: any[];
}

export function DashboardTab({ organiserProfile, events }: DashboardTabProps) {
    const [activeTab, setActiveTab] = useState('overview');

    // Mock event data
    const mockEventData: EventData[] = events.map((event) => ({
        id: event.id,
        title: event.title,
        date: event.starts_at,
        attendees: event.confirmedBookings,
        capacity: event.max_attendees || 0,
        revenue: 0,
        status: new Date(event.ends_at) > new Date() ? 'upcoming' : 'past',
    }));

    // Mock ticket data with attendance information
    const mockTicketData: TicketData[] = events.flatMap((event) => {
        const ticketTypes = ['General', 'VIP', 'Early Bird'];
        return ticketTypes.map((type) => {
            const total = Math.floor(Math.random() * 200) + 50;
            const sold = Math.floor(Math.random() * total);
            const scanned = Math.floor(Math.random() * sold);
            const price =
                type === 'VIP' ? 99.99 : type === 'Early Bird' ? 29.99 : 49.99;

            return {
                id: `${event.id}-${type}`,
                event_id: event.id,
                event_name: event.title,
                ticket_type: type,
                total_tickets: total,
                tickets_sold: sold,
                tickets_scanned: scanned,
                scan_rate: (scanned / sold) * 100,
                peak_time: '19:30',
                average_duration: Math.floor(Math.random() * 180) + 60, // 1-4 hours in minutes
                price: price,
                revenue: sold * price,
            };
        });
    });

    // Mock financial data
    const mockFinancialData: FinancialData[] = events.map((event) => {
        const gross = Math.floor(Math.random() * 5000) + 1000;
        const fees = gross * 0.029 + 0.3;
        return {
            id: event.id,
            event_id: event.id,
            gross_revenue: gross,
            processing_fees: fees,
            net_revenue: gross - fees,
            refund_amount: 0,
            refund_count: 0,
            payment_status: 'succeeded',
            transaction_type: 'payment',
            capacity: event.max_attendees || 0,
        };
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="space-y-4"
                >
                    <ResponsiveTabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                    />

                    <TabsContent value="overview">
                        <OverviewTab events={mockEventData} />
                    </TabsContent>

                    <TabsContent value="tickets">
                        <DataTable<TicketData, unknown>
                            columns={ticketColumns}
                            data={mockTicketData}
                        />
                    </TabsContent>

                    <TabsContent value="events">
                        <DataTable<EventData, unknown>
                            columns={eventColumns}
                            data={mockEventData}
                        />
                    </TabsContent>

                    <TabsContent value="sales">
                        <DataTable<FinancialData, unknown>
                            columns={financialColumns}
                            data={mockFinancialData}
                        />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
