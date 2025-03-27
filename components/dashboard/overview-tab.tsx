'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
    CalendarDays,
    Users,
    Ticket,
    TrendingUp,
    CreditCard,
    RefreshCcw,
    Mail,
} from 'lucide-react';
import { EventData } from './columns';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

interface OverviewTabProps {
    events: EventData[];
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
    }).format(amount);
};

const formatPercentage = (value: number) => {
    return `${Math.round(value)}%`;
};

export function OverviewTab({ events }: OverviewTabProps) {
    // finance metrics
    const totalRevenue = events.reduce((sum, event) => sum + event.revenue, 0);
    const totalRefunds = 0; // TODO: Add from payment_transactions
    const netRevenue = totalRevenue - totalRefunds;
    const processingFees = totalRevenue * 0.029 + events.length * 0.2; // Example Stripe fees

    // attendance metrics
    const totalTickets = events.reduce((sum, event) => sum + event.capacity, 0);
    const totalAttendees = events.reduce(
        (sum, event) => sum + event.attendees,
        0
    );
    const averageAttendance = (totalAttendees / totalTickets) * 100;

    // event metrics
    const upcomingEvents = events.filter(
        (event) => event.status === 'upcoming'
    ).length;
    const pastEvents = events.filter((event) => event.status === 'past').length;
    const totalEvents = events.length;

    // marketing metrics (mock data to be replaced with real data)
    const marketingStats = {
        emailsSent: 1250,
        openRate: 45.2,
        clickRate: 12.8,
        conversions: 89,
    };

    // chart data for daily sales activity
    const dailySalesData = [
        { date: 'Mon', sales: 2450, tickets: 82 },
        { date: 'Tue', sales: 3120, tickets: 95 },
        { date: 'Wed', sales: 2840, tickets: 88 },
        { date: 'Thu', sales: 3580, tickets: 112 },
        { date: 'Fri', sales: 4220, tickets: 138 },
        { date: 'Sat', sales: 5150, tickets: 165 },
        { date: 'Sun', sales: 3890, tickets: 124 },
    ];

    const formatYAxis = (value: number) => {
        if (value >= 1000) {
            return `£${value / 1000}k`;
        }
        return `£${value}`;
    };

    return (
        <div className="space-y-6">
            {/* statistics cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Net Revenue
                        </CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(netRevenue)}
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <span className="text-green-500 mr-1">
                                {formatCurrency(totalRevenue)} gross
                            </span>
                            <span className="text-red-500">
                                -{formatCurrency(processingFees)} fees
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Events
                        </CardTitle>
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalEvents}</div>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <span className="text-green-500 mr-1">
                                {upcomingEvents} upcoming
                            </span>
                            <span className="text-gray-500">
                                {pastEvents} past
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Attendance Rate
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatPercentage(averageAttendance)}
                        </div>
                        <div className="mt-2">
                            <Progress
                                value={averageAttendance}
                                className="h-2"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Marketing
                        </CardTitle>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatPercentage(marketingStats.openRate)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Email open rate from {marketingStats.emailsSent}{' '}
                            sent
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* chart Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">
                        Daily Sales Activity
                    </CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={dailySalesData}
                                margin={{
                                    top: 5,
                                    right: 10,
                                    left: -10,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="hsl(var(--border))"
                                />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12 }}
                                    dy={10}
                                    stroke="hsl(var(--muted-foreground))"
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12 }}
                                    stroke="hsl(var(--muted-foreground))"
                                    width={50}
                                    tickFormatter={formatYAxis}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor:
                                            'hsl(var(--background))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                    }}
                                    formatter={(
                                        value: number,
                                        name: string
                                    ) => [
                                        name === 'sales'
                                            ? formatCurrency(value)
                                            : value,
                                        name === 'sales' ? 'Sales' : 'Tickets',
                                    ]}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={2}
                                    dot={false}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="tickets"
                                    stroke="hsl(var(--secondary))"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* event Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                    <Card key={event.id}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base">
                                    {event.title}
                                </CardTitle>
                                <Badge
                                    variant={
                                        event.status === 'upcoming'
                                            ? 'default'
                                            : event.status === 'past'
                                              ? 'secondary'
                                              : 'destructive'
                                    }
                                >
                                    {event.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <CalendarDays className="mr-2 h-4 w-4" />
                                    {event.date}
                                </div>
                                <div className="flex items-center text-sm">
                                    <Users className="mr-2 h-4 w-4" />
                                    <span>
                                        {event.attendees}/{event.capacity}{' '}
                                        attendees
                                    </span>
                                </div>
                                <Progress
                                    value={
                                        (event.attendees / event.capacity) * 100
                                    }
                                    className="h-2"
                                />
                                <div className="flex items-center text-sm">
                                    <TrendingUp className="mr-2 h-4 w-4" />
                                    <span>{formatCurrency(event.revenue)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
