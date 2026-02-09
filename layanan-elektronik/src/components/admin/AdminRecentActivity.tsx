import { useEffect, useState } from "react";
import { orderService } from "@/services";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import type { Order } from "@/types";

export function AdminRecentActivity() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await orderService.getAll();
            // Sort by latest
            const sorted = (data || []).sort((a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            // Limit to 5 most recent
            setOrders(sorted.slice(0, 5));
        } catch (error) {
            console.error('Failed to load recent activity:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48 bg-white rounded-lg border border-zinc-200">
                <Loader2 className="w-8 h-8 animate-spin text-blue-900" />
            </div>
        );
    }

    return (
        <Card className="border-zinc-200">
            <CardHeader>
                <CardTitle>Aktivitas Terbaru</CardTitle>
                <CardDescription>5 pesanan terbaru yang masuk ke sistem</CardDescription>
            </CardHeader>
            <CardContent>
                {orders.length === 0 ? (
                    <div className="text-center py-8 text-zinc-600">
                        Belum ada aktivitas terbaru
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Order ID</TableHead>
                                <TableHead>User ID</TableHead>
                                <TableHead>Layanan</TableHead>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.order_id}>
                                    <TableCell className="font-medium">#{order.order_id}</TableCell>
                                    <TableCell>{order.user_id}</TableCell>
                                    <TableCell>{order.service_name || `Service ${order.service_id}`}</TableCell>
                                    <TableCell>
                                        {format(new Date(order.created_at), 'dd MMM yyyy, HH:mm', { locale: idLocale })}
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={order.status} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
