import { useEffect, useState } from "react";
import { authService, orderService, paymentService } from "@/services";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Package,
  MapPin,
  Wrench,
  CreditCard,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { formatCurrency } from "@/lib/utils";
import type { Order, Payment } from "@/types";
import { toast } from "sonner";

interface OrderWithPayment extends Order {
  payment?: Payment | null;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderWithPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithPayment | null>(
    null,
  );
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("transfer");
  const [creatingPayment, setCreatingPayment] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  // Add this at the top of the loadOrders function in OrdersPage.tsx

  const loadOrders = async () => {
    console.log("📦 OrdersPage: loadOrders() started");
    console.log(
      "🔑 OrdersPage: Token from authService:",
      authService.getToken()?.substring(0, 20) + "...",
    );

    try {
      console.log("🌐 OrdersPage: Calling orderService.getMyOrders()...");
      const data = await orderService.getMyOrders();
      console.log("✅ OrdersPage: Received", data?.length || 0, "orders");
      console.log(
        "🔑 After setToken - orderService has token?",
        !!(orderService as any).token,
      );

      // Fetch payment info for completed orders
      console.log(
        "💳 OrdersPage: Fetching payment info for completed orders...",
      );
      const ordersWithPayments = await Promise.all(
        data.map(async (order, index) => {
          if (order.status === "completed") {
            console.log(
              `💳 OrdersPage: Fetching payment for order #${order.order_id}`,
            );
            try {
              const payments = await paymentService.getByOrder(
                order.order_id.toString(),
              );
              const latestPayment =
                payments && payments.length > 0 ? payments[0] : null;
              console.log(
                `✅ OrdersPage: Payment found for order #${order.order_id}:`,
                !!latestPayment,
              );
              return { ...order, payment: latestPayment };
            } catch (error) {
              console.log(
                `⚠️ OrdersPage: No payment for order #${order.order_id}`,
              );
              return { ...order, payment: null };
            }
          }
          return { ...order, payment: null };
        }),
      );

      console.log(
        "✅ OrdersPage: Setting orders state with",
        ordersWithPayments.length,
        "orders",
      );
      setOrders(ordersWithPayments || []);
    } catch (error) {
      console.error("❌ OrdersPage: Failed to load orders:", error);
      console.error("❌ OrdersPage: Error details:", error);
    } finally {
      console.log("⏳ OrdersPage: Setting loading = false");
      setLoading(false);
    }
  };

  const handlePaymentClick = (order: OrderWithPayment) => {
    setSelectedOrder(order);
    setPaymentMethod("transfer");
    setIsPaymentDialogOpen(true);
  };

  const handleCreatePayment = async () => {
    if (!selectedOrder) return;

    setCreatingPayment(true);
    try {
      const payment = await paymentService.create(
        selectedOrder.order_id,
        paymentMethod,
      );

      toast.success(`Pembayaran berhasil dibuat! ID: ${payment.payment_id}`);
      setIsPaymentDialogOpen(false);
      loadOrders(); // Refresh orders to update payment status
    } catch (error: any) {
      console.error("Failed to create payment:", error);
      toast.error(error.message || "Gagal membuat pembayaran");
    } finally {
      setCreatingPayment(false);
    }
  };

  const renderOrderList = (filteredOrders: OrderWithPayment[]) => {
    if (filteredOrders.length === 0) {
      return (
        <div className="text-center py-16 bg-white rounded-lg border border-dashed border-zinc-300">
          <Package className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-zinc-900">
            Tidak ada pesanan
          </h3>
          <p className="text-zinc-500 mt-1 mb-6">
            Tidak ada pesanan dalam kategori ini.
          </p>
          <Button
            variant="outline"
            className="text-blue-900 border-blue-200 hover:bg-blue-50"
          >
            Buat Pesanan Baru
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card
            key={order.order_id}
            className="border-zinc-200 overflow-hidden"
          >
            <CardHeader className="bg-zinc-50 border-b border-zinc-100 py-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white border border-zinc-200 rounded-lg">
                    <Package className="w-5 h-5 text-blue-900" />
                  </div>
                  <div>
                    <CardTitle className="text-base">
                      Order #{order.order_id}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Dibuat pada{" "}
                      {format(
                        new Date(order.created_at),
                        "dd MMMM yyyy, HH:mm",
                        { locale: id },
                      )}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <StatusBadge status={order.status} />
                  {/* Payment Status Badge */}
                  {order.status === "completed" && order.payment && (
                    <Badge
                      variant="outline"
                      className={
                        order.payment.status === "paid"
                          ? "bg-green-50 text-green-700 border-green-300"
                          : "bg-amber-50 text-amber-700 border-amber-300"
                      }
                    >
                      {order.payment.status === "paid" ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Terbayar
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </>
                      )}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Wrench className="w-5 h-5 text-zinc-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm text-zinc-900">
                        Detail Perangkat
                      </p>
                      <p className="text-zinc-600">
                        {order.device_brand} - {order.device_type}
                      </p>
                      <p className="text-sm text-zinc-500 mt-1 italic">
                        "{order.problem_description}"
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-zinc-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm text-zinc-900">
                        Lokasi Penjemputan
                      </p>
                      <p className="text-zinc-600">{order.address}</p>
                    </div>
                  </div>

                  {order.technician_name && (
                    <div className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                      <div>
                        <p className="font-medium text-sm text-blue-900">
                          Teknisi: {order.technician_name}
                        </p>
                        {order.technician_phone && (
                          <p className="text-xs text-blue-700">
                            {order.technician_phone}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Section for Completed Orders */}
              {order.status === "completed" && (
                <div className="mt-6 pt-6 border-t border-zinc-200">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <p className="text-sm text-zinc-600">
                        Total Biaya Perbaikan
                      </p>
                      <p className="text-2xl font-bold text-blue-900">
                        {formatCurrency(
                          order.final_cost || order.cost_estimation || 0,
                        )}
                      </p>
                    </div>

                    {/* Show payment button or status */}
                    {!order.payment ? (
                      <Button
                        onClick={() => handlePaymentClick(order)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Bayar Sekarang
                      </Button>
                    ) : order.payment.status === "pending" ? (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-amber-600" />
                          <div>
                            <p className="text-sm font-medium text-amber-900">
                              Pembayaran Menunggu Konfirmasi
                            </p>
                            <p className="text-xs text-amber-700">
                              ID: {order.payment.payment_id}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <div>
                            <p className="text-sm font-medium text-green-900">
                              ✓ Pembayaran Lunas
                            </p>
                            <p className="text-xs text-green-700">
                              Dikonfirmasi:{" "}
                              {order.payment.paid_at
                                ? format(
                                    new Date(order.payment.paid_at),
                                    "dd MMM yyyy",
                                    { locale: id },
                                  )
                                : "-"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Show cost estimation for in-progress orders */}
              {order.status === "on_progress" && order.cost_estimation && (
                <div className="mt-6 pt-6 border-t border-zinc-200">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-sm text-amber-800 font-medium">
                      Estimasi Biaya
                    </p>
                    <p className="text-xl font-bold text-amber-900 mt-1">
                      {formatCurrency(order.cost_estimation)}
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      *Biaya final akan dikonfirmasi setelah perbaikan selesai
                    </p>
                  </div>
                </div>
              )}
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
    {
      value: "waiting",
      label: "Menunggu",
      filter: (o: OrderWithPayment) => o.status === "waiting",
    },
    {
      value: "on_progress",
      label: "Diproses",
      filter: (o: OrderWithPayment) => o.status === "on_progress",
    },
    {
      value: "completed",
      label: "Selesai",
      filter: (o: OrderWithPayment) => o.status === "completed",
    },
    {
      value: "cancelled",
      label: "Dibatalkan",
      filter: (o: OrderWithPayment) => o.status === "cancelled",
    },
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

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-900" />
              Pembayaran Order #{selectedOrder?.order_id}
            </DialogTitle>
            <DialogDescription>
              Pilih metode pembayaran untuk menyelesaikan transaksi
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Total Amount */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 font-medium">
                Total Pembayaran
              </p>
              <p className="text-3xl font-bold text-blue-900 mt-1">
                {formatCurrency(
                  selectedOrder?.final_cost ||
                    selectedOrder?.cost_estimation ||
                    0,
                )}
              </p>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-2">
              <Label htmlFor="payment-method">Metode Pembayaran</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger id="payment-method">
                  <SelectValue placeholder="Pilih metode pembayaran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transfer">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      <span>Transfer Bank</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="cash">
                    <div className="flex items-center gap-2">
                      💵
                      <span>Tunai</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="ewallet">
                    <div className="flex items-center gap-2">
                      📱
                      <span>E-Wallet (GoPay, OVO, Dana)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Instructions */}
            {paymentMethod === "transfer" && (
              <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 text-sm">
                <p className="font-medium text-zinc-900 mb-2">
                  Instruksi Transfer:
                </p>
                <ul className="space-y-1 text-zinc-600">
                  <li>• Bank BCA: 1234567890 a/n Fix Service</li>
                  <li>• Bank Mandiri: 0987654321 a/n Fix Service</li>
                  <li>
                    • Konfirmasi akan dikirim setelah pembayaran terverifikasi
                  </li>
                </ul>
              </div>
            )}

            {paymentMethod === "cash" && (
              <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 text-sm">
                <p className="font-medium text-zinc-900 mb-2">
                  Pembayaran Tunai:
                </p>
                <p className="text-zinc-600">
                  Pembayaran dapat dilakukan langsung kepada teknisi saat
                  pengantaran perangkat.
                </p>
              </div>
            )}

            {paymentMethod === "ewallet" && (
              <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 text-sm">
                <p className="font-medium text-zinc-900 mb-2">E-Wallet:</p>
                <ul className="space-y-1 text-zinc-600">
                  <li>• GoPay: 08123456789</li>
                  <li>• OVO: 08123456789</li>
                  <li>• DANA: 08123456789</li>
                </ul>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPaymentDialogOpen(false)}
              disabled={creatingPayment}
            >
              Batal
            </Button>
            <Button
              onClick={handleCreatePayment}
              disabled={creatingPayment}
              className="bg-green-600 hover:bg-green-700"
            >
              {creatingPayment ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Konfirmasi Pembayaran
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
