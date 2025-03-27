import { ColumnDef } from '@tanstack/react-table';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export interface MarketingData {
    id: string;
    event_id: string;
    campaign_name: string;
    campaign_type: 'email' | 'social' | 'paid_ads' | 'other';
    status: 'draft' | 'active' | 'completed' | 'cancelled';
    impressions: number;
    clicks: number;
    conversions: number;
    email_opens: number;
    email_clicks: number;
    budget: number;
    revenue: number;
}

export const marketingColumns: ColumnDef<MarketingData>[] = [
    {
        accessorKey: 'campaign_name',
        header: 'Campaign',
        cell: ({ row }) => (
            <div className="space-y-1">
                <div className="font-medium">
                    {row.getValue('campaign_name')}
                </div>
                <Badge variant="outline">{row.getValue('campaign_type')}</Badge>
            </div>
        ),
    },
    {
        accessorKey: 'engagement',
        header: 'Engagement',
        cell: ({ row }) => {
            const data = row.original;
            const clickRate = (data.clicks / data.impressions) * 100;
            const openRate = data.email_opens
                ? (data.email_opens / data.impressions) * 100
                : null;

            return (
                <div className="space-y-2">
                    <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">
                            Click Rate
                        </div>
                        <div className="flex items-center">
                            <Progress value={clickRate} className="h-2 mr-2" />
                            <span className="text-xs">
                                {clickRate.toFixed(1)}%
                            </span>
                        </div>
                    </div>
                    {openRate && (
                        <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">
                                Open Rate
                            </div>
                            <div className="flex items-center">
                                <Progress
                                    value={openRate}
                                    className="h-2 mr-2"
                                />
                                <span className="text-xs">
                                    {openRate.toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'conversions',
        header: 'Conversions',
        cell: ({ row }) => {
            const data = row.original;
            const conversionRate = (data.conversions / data.clicks) * 100;

            return (
                <div className="space-y-1">
                    <div className="font-medium">{data.conversions}</div>
                    <div className="text-xs text-muted-foreground">
                        {conversionRate.toFixed(1)}% rate
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: 'roi',
        header: 'ROI',
        cell: ({ row }) => {
            const data = row.original;
            const roi = ((data.revenue - data.budget) / data.budget) * 100;

            return (
                <div className="space-y-1">
                    <div
                        className={`font-medium ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`}
                    >
                        {roi.toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                        £{data.revenue.toLocaleString()} revenue
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            return (
                <Badge
                    variant={
                        status === 'active'
                            ? 'default'
                            : status === 'completed'
                              ? 'secondary'
                              : status === 'draft'
                                ? 'outline'
                                : 'destructive'
                    }
                >
                    {status}
                </Badge>
            );
        },
    },
];
