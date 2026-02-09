import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, DollarSign, TrendingUp } from "lucide-react";
import type { DashboardStats } from "@/types";

import { formatCurrency } from "@/lib/utils";

interface AdminStatsCardsProps {
    stats: DashboardStats;
}

export function AdminStatsCards({ stats }: AdminStatsCardsProps) {

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-zinc-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-600">
                        Total Users
                    </CardTitle>
                    <Users className="w-4 h-4 text-zinc-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-zinc-900">{stats.total_users}</div>
                    <p className="text-xs text-zinc-600 mt-1">
                        +{stats.total_technicians} teknisi
                    </p>
                </CardContent>
            </Card>

            <Card className="border-zinc-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-600">
                        Total Pesanan
                    </CardTitle>
                    <Package className="w-4 h-4 text-zinc-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-zinc-900">{stats.total_orders}</div>
                    <p className="text-xs text-zinc-600 mt-1">
                        {stats.pending_orders} menunggu
                    </p>
                </CardContent>
            </Card>

            <Card className="border-zinc-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-600">
                        Total Revenue
                    </CardTitle>
                    <DollarSign className="w-4 h-4 text-zinc-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-zinc-900">
                        {formatCurrency(stats.total_revenue)}
                    </div>
                    <p className="text-xs text-zinc-600 mt-1">
                        {stats.completed_orders} selesai
                    </p>
                </CardContent>
            </Card>

            <Card className="border-zinc-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-600">
                        Revenue Bulan Ini
                    </CardTitle>
                    <TrendingUp className="w-4 h-4 text-zinc-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-zinc-900">
                        {formatCurrency(stats.monthly_revenue)}
                    </div>
                    <p className="text-xs text-green-600 mt-1">
                        +{stats.total_revenue > 0 ? Math.round((stats.monthly_revenue / stats.total_revenue) * 100) : 0}% dari total
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
