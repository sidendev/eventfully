import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export interface TicketData {
    id: string;
    event_id: string;
    event_name: string;
    ticket_type: string;
    total_tickets: number;
    tickets_sold: number;
    tickets_scanned: number;
    scan_rate: number;
    peak_time: string;
    average_duration: number;
    price: number;
    revenue: number;
}

// Local currency formatter
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
    }).format(amount);
};

// Format duration in hours and minutes
const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
};

export const ticketColumns: ColumnDef<TicketData>[] = [
    {
        accessorKey: 'event_name',
        header: 'Event',
        cell: ({ row }) => (
            <div className="max-w-[200px] truncate font-medium">
                {row.getValue('event_name')}
            </div>
        ),
    },
    {
        accessorKey: 'ticket_type',
        header: 'Type',
        cell: ({ row }) => (
            <Badge variant="outline">{row.getValue('ticket_type')}</Badge>
        ),
    },
    {
        accessorKey: 'total_tickets',
        header: 'Total',
    },
    {
        accessorKey: 'tickets_sold',
        header: 'Sales',
        cell: ({ row }) => {
            const sold = row.original.tickets_sold;
            const total = row.original.total_tickets;
            const percentage = (sold / total) * 100;

            return (
                <div className="space-y-2">
                    <div className="text-sm font-medium">
                        {sold}/{total}
                    </div>
                    <Progress value={percentage} className="h-2" />
                </div>
            );
        },
    },
    {
        accessorKey: 'tickets_scanned',
        header: 'Check-ins',
        cell: ({ row }) => {
            const scanned = row.original.tickets_scanned;
            const sold = row.original.tickets_sold;
            const scanRate = (scanned / sold) * 100;

            return (
                <div className="space-y-2">
                    <div className="text-sm font-medium">
                        {scanned}/{sold}
                    </div>
                    <Progress value={scanRate} className="h-2" />
                </div>
            );
        },
    },
    {
        accessorKey: 'peak_time',
        header: 'Peak Time',
        cell: ({ row }) => (
            <div className="text-sm text-muted-foreground">
                {row.getValue('peak_time')}
            </div>
        ),
    },
    {
        accessorKey: 'average_duration',
        header: 'Avg. Duration',
        cell: ({ row }) => (
            <div className="text-sm text-muted-foreground">
                {formatDuration(row.getValue('average_duration') as number)}
            </div>
        ),
    },
    {
        accessorKey: 'revenue',
        header: 'Revenue',
        cell: ({ row }) => (
            <div className="font-medium">
                {formatCurrency(row.getValue('revenue') as number)}
            </div>
        ),
    },
];
