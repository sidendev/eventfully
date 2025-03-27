import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';

export interface FinancialData {
    id: string;
    event_id: string;
    gross_revenue: number;
    net_revenue: number;
    processing_fees: number;
    refund_amount: number;
    refund_count: number;
    payment_status: 'succeeded' | 'pending' | 'failed';
    transaction_type: 'payment' | 'refund' | 'chargeback';
    capacity: number;
}

// Local currency formatter
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
    }).format(amount);
};

export const financialColumns: ColumnDef<FinancialData>[] = [
    {
        accessorKey: 'gross_revenue',
        header: 'Gross Revenue',
        cell: ({ row }) => (
            <div className="font-medium">
                {formatCurrency(row.getValue('gross_revenue') as number)}
            </div>
        ),
    },
    {
        accessorKey: 'net_revenue',
        header: 'Net Revenue',
        cell: ({ row }) => (
            <div className="text-muted-foreground">
                {formatCurrency(row.getValue('net_revenue') as number)}
            </div>
        ),
    },
    {
        accessorKey: 'processing_fees',
        header: 'Processing Fees',
        cell: ({ row }) => (
            <div className="text-muted-foreground">
                {formatCurrency(row.getValue('processing_fees') as number)}
            </div>
        ),
    },
    {
        accessorKey: 'refund_amount',
        header: 'Refunds',
        cell: ({ row }) => (
            <div className="space-y-1">
                <div className="text-muted-foreground">
                    {formatCurrency(row.original.refund_amount)}
                </div>
                <div className="text-xs text-muted-foreground">
                    {row.original.refund_count} refunds
                </div>
            </div>
        ),
    },
    {
        accessorKey: 'payment_status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('payment_status') as
                | 'succeeded'
                | 'pending'
                | 'failed';
            return (
                <Badge
                    variant={
                        status === 'succeeded'
                            ? 'default'
                            : status === 'pending'
                              ? 'secondary'
                              : 'destructive'
                    }
                >
                    {status}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'transaction_type',
        header: 'Type',
        cell: ({ row }) => {
            const type = row.getValue('transaction_type') as
                | 'payment'
                | 'refund'
                | 'chargeback';
            return <Badge variant="outline">{type}</Badge>;
        },
    },
    {
        accessorKey: 'capacity',
        header: 'Capacity',
    },
];
