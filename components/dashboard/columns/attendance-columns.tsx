import { ColumnDef } from '@tanstack/react-table';
import { Progress } from '@/components/ui/progress';

export interface AttendanceData {
    id: string;
    event_id: string;
    total_tickets: number;
    scanned_tickets: number;
    scan_rate: number;
    peak_time: string;
    average_duration: number;
}

export const attendanceColumns: ColumnDef<AttendanceData>[] = [
    {
        accessorKey: 'total_tickets',
        header: 'Total Tickets',
        cell: ({ row }) => (
            <div className="font-medium">{row.getValue('total_tickets')}</div>
        ),
    },
    {
        accessorKey: 'scan_rate',
        header: 'Check-in Rate',
        cell: ({ row }) => {
            const rate = row.getValue('scan_rate') as number;
            return (
                <div className="space-y-1">
                    <div className="text-sm font-medium">
                        {rate.toFixed(1)}%
                    </div>
                    <Progress value={rate} className="h-2" />
                </div>
            );
        },
    },
    {
        accessorKey: 'peak_time',
        header: 'Peak Time',
        cell: ({ row }) => (
            <div className="text-muted-foreground">
                {row.getValue('peak_time')}
            </div>
        ),
    },
    {
        accessorKey: 'average_duration',
        header: 'Avg. Duration',
        cell: ({ row }) => {
            const duration = row.getValue('average_duration') as number;
            const hours = Math.floor(duration / 60);
            const minutes = duration % 60;
            return (
                <div className="text-muted-foreground">
                    {hours}h {minutes}m
                </div>
            );
        },
    },
];
