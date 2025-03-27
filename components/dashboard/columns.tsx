import { ColumnDef } from '@tanstack/react-table';
import { formatDate } from '@/lib/utils';

// Types
export type EventData = {
    id: string;
    title: string;
    date: string;
    attendees: number;
    capacity: number; // Changed back to required since we always provide it
    revenue: number;
    status: 'upcoming' | 'past' | 'cancelled';
};

export type TicketData = {
    id: string;
    eventName: string;
    ticketType: string;
    sold: number;
    available?: number; // Made optional
    price: number;
    revenue: number;
};

export type SalesData = {
    id: string;
    eventName: string;
    date: string;
    ticketsSold: number;
    revenue: number;
    ticketType: string;
};

// Column Definitions
export const eventColumns: ColumnDef<EventData>[] = [
    {
        accessorKey: 'title',
        header: 'Event Name',
        cell: ({ row }) => (
            <div className="max-w-[200px] truncate">
                {row.getValue('title')}
            </div>
        ),
    },
    {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) => (
            <div className="whitespace-nowrap">
                {formatDate(row.getValue('date'))}
            </div>
        ),
    },
    {
        accessorKey: 'capacity',
        header: 'Capacity',
    },
    {
        accessorKey: 'attendees',
        header: 'Attendees',
        cell: ({ row }) => {
            const attendees = row.getValue('attendees') as number;
            const capacity = row.original.capacity;
            return (
                <div className="whitespace-nowrap">
                    {`${attendees}/${capacity}`}
                </div>
            );
        },
    },
    {
        accessorKey: 'revenue',
        header: 'Revenue',
        cell: ({ row }) => (
            <div className="whitespace-nowrap">
                {`£${row.getValue('revenue')}`}
            </div>
        ),
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            return (
                <span
                    className={`capitalize whitespace-nowrap ${
                        status === 'upcoming'
                            ? 'text-green-600'
                            : status === 'past'
                              ? 'text-gray-600'
                              : 'text-red-600'
                    }`}
                >
                    {status}
                </span>
            );
        },
    },
];

export const ticketColumns: ColumnDef<TicketData>[] = [
    {
        accessorKey: 'eventName',
        header: 'Event',
        cell: ({ row }) => (
            <div className="max-w-[200px] truncate">
                {row.getValue('eventName')}
            </div>
        ),
    },
    {
        accessorKey: 'ticketType',
        header: 'Type',
        cell: ({ row }) => (
            <div className="whitespace-nowrap">
                {row.getValue('ticketType')}
            </div>
        ),
    },
    {
        accessorKey: 'sold',
        header: 'Sold',
        cell: ({ row }) => {
            const sold = row.getValue('sold') as number;
            const available = row.getValue('available') as number | undefined;
            return (
                <div className="whitespace-nowrap">
                    {available
                        ? `${sold}/${sold + available}`
                        : sold.toString()}
                </div>
            );
        },
    },
    {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => (
            <div className="whitespace-nowrap">
                {`£${row.getValue('price')}`}
            </div>
        ),
    },
    {
        accessorKey: 'revenue',
        header: 'Revenue',
        cell: ({ row }) => (
            <div className="whitespace-nowrap">
                {`£${row.getValue('revenue')}`}
            </div>
        ),
    },
];

export const salesColumns: ColumnDef<SalesData>[] = [
    {
        accessorKey: 'eventName',
        header: 'Event',
        cell: ({ row }) => (
            <div className="max-w-[200px] truncate">
                {row.getValue('eventName')}
            </div>
        ),
    },
    {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) => (
            <div className="whitespace-nowrap">
                {formatDate(row.getValue('date'))}
            </div>
        ),
    },
    {
        accessorKey: 'ticketsSold',
        header: 'Sold',
        cell: ({ row }) => (
            <div className="whitespace-nowrap">
                {row.getValue('ticketsSold')}
            </div>
        ),
    },
    {
        accessorKey: 'ticketType',
        header: 'Type',
        cell: ({ row }) => (
            <div className="whitespace-nowrap">
                {row.getValue('ticketType')}
            </div>
        ),
    },
    {
        accessorKey: 'revenue',
        header: 'Revenue',
        cell: ({ row }) => (
            <div className="whitespace-nowrap">
                {`£${row.getValue('revenue')}`}
            </div>
        ),
    },
];
