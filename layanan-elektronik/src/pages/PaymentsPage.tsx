import { useEffect, useState } from "react";
import { orderService, paymentService } from "@/services";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Loader2, CreditCard, Printer } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { formatCurrency } from "@/lib/utils";
import type { Payment, Order } from "@/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const escapeHtml = (value: string): string =>
    value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");

export default function PaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [ordersById, setOrdersById] = useState<Record<number, Order>>({});

    useEffect(() => {
        loadPayments();
    }, []);

    const loadPayments = async () => {
        try {
            const orders = await orderService.getMyOrders();
            const allPayments: Payment[] = [];

            const orderMap = orders.reduce<Record<number, Order>>((acc, order) => {
                acc[order.order_id] = order;
                return acc;
            }, {});
            setOrdersById(orderMap);

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

    const handlePrintInvoice = (payment: Payment) => {
        if (payment.status !== "paid") {
            toast.error("Invoice hanya dapat dicetak jika pembayaran sudah lunas");
            return;
        }

        const order = ordersById[payment.order_id];
        const printWindow = window.open("", "_blank", "width=900,height=720");

        if (!printWindow) {
            toast.error("Gagal membuka jendela cetak");
            return;
        }

        const paidDate = payment.paid_at || payment.created_at;
        const serviceName = order?.service_name || "Perbaikan Elektronik";
        const deviceLabel = order
            ? `${order.device_brand} - ${order.device_type}`
            : `Order #${payment.order_id}`;

        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8" />
            <title>Invoice ${payment.payment_id}</title>
            <style>
              body { font-family: Arial, sans-serif; color: #0f172a; margin: 28px; }
              .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; }
              .brand { font-size: 24px; font-weight: 700; color: #1e3a8a; }
              .meta { text-align: right; font-size: 13px; color: #475569; }
              .card { border: 1px solid #dbeafe; border-radius: 12px; padding: 16px; background: #f8fbff; margin-bottom: 16px; }
              .title { font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 12px; }
              .row { display: flex; justify-content: space-between; gap: 18px; margin-bottom: 8px; font-size: 14px; }
              .key { color: #64748b; }
              .value { color: #0f172a; font-weight: 600; text-align: right; }
              .total { margin-top: 12px; border-top: 1px dashed #bfdbfe; padding-top: 12px; }
              .amount { font-size: 22px; color: #1e3a8a; font-weight: 700; }
              .footer { margin-top: 24px; font-size: 12px; color: #64748b; }
            </style>
          </head>
          <body>
            <div class="header">
              <div>
                <div class="brand">FixIt Service</div>
                <div style="color:#475569; font-size:13px; margin-top:4px;">Invoice / Nota Pembayaran</div>
              </div>
              <div class="meta">
                <div><strong>${escapeHtml(payment.payment_id)}</strong></div>
                <div>${escapeHtml(
                    format(new Date(paidDate), "dd MMMM yyyy, HH:mm", { locale: id }),
                )}</div>
              </div>
            </div>

            <div class="card">
              <div class="title">Informasi Perbaikan</div>
              <div class="row"><span class="key">Order</span><span class="value">#${payment.order_id}</span></div>
              <div class="row"><span class="key">Layanan</span><span class="value">${escapeHtml(serviceName)}</span></div>
              <div class="row"><span class="key">Perangkat</span><span class="value">${escapeHtml(deviceLabel)}</span></div>
              <div class="row"><span class="key">Teknisi</span><span class="value">${escapeHtml(order?.technician_name || "-")}</span></div>
            </div>

            <div class="card">
              <div class="title">Rincian Pembayaran</div>
              <div class="row"><span class="key">Metode</span><span class="value">${escapeHtml(payment.payment_method)}</span></div>
              <div class="row"><span class="key">Status</span><span class="value">Lunas</span></div>
              <div class="row total">
                <span class="key">Total</span>
                <span class="amount">${escapeHtml(formatCurrency(payment.amount))}</span>
              </div>
            </div>

            <div class="footer">
              Dokumen ini dicetak otomatis dari sistem FixIt. Terima kasih telah menggunakan layanan kami.
            </div>
          </body>
          </html>
        `);

        printWindow.document.close();
        setTimeout(() => {
            printWindow.focus();
            printWindow.print();
        }, 250);
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

                            {payment.status === "paid" && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full mt-3 border-blue-200 text-blue-900 hover:bg-blue-50"
                                    onClick={() => handlePrintInvoice(payment)}
                                >
                                    <Printer className="w-4 h-4 mr-2" />
                                    Cetak Invoice / Nota
                                </Button>
                            )}
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
