import { useEffect, useState } from "react";
import { orderService } from "@/services";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Package, MapPin, Wrench } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import type { Order } from "@/types";

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await orderService.getMyOrders();
            setOrders(data || []);
        } catch (error) {
            console.error('Failed to load orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderOrderList = (filteredOrders: Order[]) => {
        if (filteredOrders.length === 0) {
            return (
                <div className="text-center py-16 bg-white rounded-lg border border-dashed border-zinc-300">
                    <Package className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-zinc-900">Tidak ada pesanan</h3>
                    <p className="text-zinc-500 mt-1 mb-6">Tidak ada pesanan dalam kategori ini.</p>
                    <Button variant="outline" className="text-blue-900 border-blue-200 hover:bg-blue-50">
                        Buat Pesanan Baru
                    </Button>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {filteredOrders.map((order) => (
                    <Card key={order.order_id} className="border-zinc-200 overflow-hidden">
                        <CardHeader className="bg-zinc-50 border-b border-zinc-100 py-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white border border-zinc-200 rounded-lg">
                                        <Package className="w-5 h-5 text-blue-900" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">Order #{order.order_id}</CardTitle>
                                        <CardDescription className="text-xs">
                                            Dibuat pada {format(new Date(order.created_at), 'dd MMMM yyyy, HH:mm', { locale: id })}
                                        </CardDescription>
                                    </div>
                                </div>
                                <div>
                                    <StatusBadge status={order.status} />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Wrench className="w-5 h-5 text-zinc-400 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-sm text-zinc-900">Detail Perangkat</p>
                                            <p className="text-zinc-600">{order.device_brand} - {order.device_type}</p>
                                            <p className="text-sm text-zinc-500 mt-1 italic">"{order.problem_description}"</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-zinc-400 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-sm text-zinc-900">Lokasi Penjemputan</p>
                                            <p className="text-zinc-600">{order.address}</p>
                                        </div>
                                    </div>

                                    {order.technician_name && (
                                        <div className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                                            <div>
                                                <p className="font-medium text-sm text-blue-900">Teknisi: {order.technician_name}</p>
                                                {order.technician_phone && (
                                                    <p className="text-xs text-blue-700">{order.technician_phone}</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-900" />
            </div>
        );
    }

    // Define tab configuration
    const tabValues = [
        { value: "all", label: "Semua", filter: () => true },
        { value: "waiting", label: "Menunggu", filter: (o: Order) => o.status === "waiting" },
        { value: "on_progress", label: "Diproses", filter: (o: Order) => o.status === "on_progress" },
        { value: "completed", label: "Selesai", filter: (o: Order) => o.status === "completed" },
        { value: "cancelled", label: "Dibatalkan", filter: (o: Order) => o.status === "cancelled" },
    ];

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-zinc-900">Pesanan Saya</h2>
                <p className="text-zinc-600 mt-2">
                    Riwayat dan status perbaikan perangkat elektronik Anda
                </p>
            </div>

            <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-zinc-100 p-1 mb-8 gap-0 h-auto">
                    {tabValues.map((tab) => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className="data-[state=active]:bg-white data-[state=active]:text-blue-900 data-[state=active]:shadow-sm py-2.5"
                        >
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {tabValues.map((tab) => (
                    <TabsContent key={tab.value} value={tab.value} className="mt-0">
                        {renderOrderList(orders.filter(tab.filter))}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
