import { useEffect, useState } from "react";
import { orderService, paymentService } from "@/services";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Loader2, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { formatCurrency } from "@/lib/utils";
import type { Payment } from "@/types";

export default function PaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPayments();
    }, []);

    const loadPayments = async () => {
        try {
            const orders = await orderService.getMyOrders();
            const allPayments: Payment[] = [];

            const validOrders = orders.filter(order => order && order.order_id !== undefined && order.order_id !== null);

            const paymentPromises = validOrders.map(order =>
                paymentService.getByOrder(order.order_id.toString())
                    .catch(() => [])
            ); const results = await Promise.all(paymentPromises);

            results.forEach(orderPayments => {
                if (Array.isArray(orderPayments)) {
                    allPayments.push(...orderPayments);
                }
            });

            allPayments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

            setPayments(allPayments);
        } catch (error) {
            console.error('Failed to load payments:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-900" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-zinc-900">Pembayaran</h2>
                <p className="text-zinc-600 mt-2">
                    Riwayat transaksi pembayaran layanan Anda
                </p>
            </div>

            <div className="space-y-4">
                {payments.map((payment) => (
                    <Card key={payment.payment_id} className="border-zinc-200">
                        <CardHeader className="bg-zinc-50 border-b border-zinc-100 py-3">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-zinc-500" />
                                    <span className="font-mono text-sm text-zinc-700">{payment.payment_id}</span>
                                </div>
                                <StatusBadge status={payment.status} />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-zinc-600">Order ID</span>
                                <span className="font-medium">#{payment.order_id}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-zinc-600">Metode</span>
                                <span className="capitalize">{payment.payment_method}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-zinc-600">Tanggal</span>
                                <span className="text-sm">
                                    {format(new Date(payment.created_at), 'dd MMM yyyy, HH:mm', { locale: id })}
                                </span>
                            </div>
                            <div className="border-t border-zinc-100 mt-3 pt-3 flex justify-between items-center">
                                <span className="font-semibold text-zinc-900">Total Pembayaran</span>
                                <span className="font-bold text-blue-900 text-lg">
                                    {formatCurrency(payment.amount)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {payments.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-lg border border-dashed border-zinc-300">
                        <CreditCard className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-zinc-900">Belum ada riwayat pembayaran</h3>
                        <p className="text-zinc-500 mt-1">
                            Anda belum memiliki transaksi pembayaran yang tercatat.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
