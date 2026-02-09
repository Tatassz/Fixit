import { useEffect, useState } from "react";
import { orderService, paymentService } from "@/services";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Loader2,
  Pencil,
  Search,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { formatCurrency } from "@/lib/utils";
import type { Order, UpdateOrderStatusData, Payment } from "@/types";
import { toast } from "sonner";

interface OrderWithPayment extends Order {
  payment?: Payment | null;
  paymentStatus?: "none" | "pending" | "paid";
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderWithPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithPayment | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmingPayment, setConfirmingPayment] = useState(false);
  const [paymentFilter, setPaymentFilter] = useState<string>("all");

  const [editForm, setEditForm] = useState<UpdateOrderStatusData>({
    status: "waiting",
    technician_name: "",
    technician_phone: "",
    cost_estimation: 0,
    final_cost: 0,
  });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await orderService.getAll();

      // Fetch payment info for completed orders
      const ordersWithPayments = await Promise.all(
        data.map(async (order) => {
          if (order.status === "completed") {
            try {
              const payments = await paymentService.getByOrder(
                order.order_id.toString(),
              );
              const latestPayment =
                payments && payments.length > 0 ? payments[0] : null;

              return {
                ...order,
                payment: latestPayment,
                paymentStatus: (latestPayment
                  ? latestPayment.status === "paid"
                    ? "paid"
                    : "pending"
                  : "none") as "none" | "pending" | "paid",
              };
            } catch (error) {
              return {
                ...order,
                payment: null,
                paymentStatus: "none" as const,
              };
            }
          }
          return {
            ...order,
            payment: null,
            paymentStatus: "none" as const,
          };
        }),
      );

      setOrders(ordersWithPayments || []);
    } catch (error) {
      console.error("Failed to load orders:", error);
      toast.error("Gagal memuat data pesanan");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = async (order: OrderWithPayment) => {
    setSelectedOrder(order);
    setEditForm({
      status: order.status,
      technician_name: order.technician_name || "",
      technician_phone: order.technician_phone || "",
      cost_estimation: order.cost_estimation || 0,
      final_cost: order.final_cost || 0,
    });
    setIsDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedOrder) return;

    try {
      await orderService.updateStatus(
        selectedOrder.order_id.toString(),
        editForm,
      );
      toast.success("Status pesanan berhasil diperbarui");
      setIsDialogOpen(false);
      loadOrders(); // Refresh data
    } catch (error) {
      console.error("Failed to update order:", error);
      toast.error("Gagal memperbarui pesanan");
    }
  };

  const handleConfirmPayment = async () => {
    if (!selectedOrder || !selectedOrder.payment) return;

    setConfirmingPayment(true);
    try {
      await paymentService.confirm(selectedOrder.payment.payment_id);
      toast.success("Pembayaran berhasil dikonfirmasi");
      setIsDialogOpen(false);
      loadOrders(); // Refresh data
    } catch (error) {
      console.error("Failed to confirm payment:", error);
      toast.error("Gagal mengkonfirmasi pembayaran");
    } finally {
      setConfirmingPayment(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      order.order_id.toString().includes(searchLower) ||
      order.device_type.toLowerCase().includes(searchLower) ||
      order.device_brand.toLowerCase().includes(searchLower) ||
      (order.technician_name &&
        order.technician_name.toLowerCase().includes(searchLower))
    );
  });

  const getFilteredByStatus = (status: string) => {
    if (status === "all") return filteredOrders;
    return filteredOrders.filter((o) => o.status === status);
  };

  const getFilteredByPaymentStatus = (
    orders: OrderWithPayment[],
    paymentStatus: string,
  ) => {
    if (paymentStatus === "all") return orders;
    return orders.filter((o) => o.paymentStatus === paymentStatus);
  };

  const getPaymentStatusBadge = (order: OrderWithPayment) => {
    if (order.status !== "completed") return null;

    if (!order.payment || order.paymentStatus === "none") {
      return (
        <Badge
          variant="outline"
          className="bg-zinc-50 text-zinc-600 border-zinc-300"
        >
          <XCircle className="w-3 h-3 mr-1" />
          Belum Dibayar
        </Badge>
      );
    }

    if (order.paymentStatus === "pending") {
      return (
        <Badge
          variant="outline"
          className="bg-amber-50 text-amber-700 border-amber-300"
        >
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
    }

    return (
      <Badge
        variant="outline"
        className="bg-green-50 text-green-700 border-green-300"
      >
        <CheckCircle2 className="w-3 h-3 mr-1" />
        Terbayar
      </Badge>
    );
  };

  const orderStatusTabs = [
    { value: "all", label: "Semua" },
    { value: "waiting", label: "Menunggu" },
    { value: "on_progress", label: "Diproses" },
    { value: "completed", label: "Selesai" },
    { value: "cancelled", label: "Dibatalkan" },
  ];

  const paymentStatusTabs = [
    { value: "all", label: "Semua" },
    { value: "none", label: "Belum Dibayar" },
    { value: "pending", label: "Pending" },
    { value: "paid", label: "Terbayar" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-zinc-900">Kelola Pesanan</h2>
          <p className="text-zinc-600">
            Manajemen status perbaikan, teknisi, dan pembayaran
          </p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
          <Input
            type="search"
            placeholder="Cari ID, Device, Teknisi..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-zinc-100 p-1 mb-4 h-auto flex flex-wrap gap-1 w-full justify-start">
          {orderStatusTabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="px-4 py-2"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {orderStatusTabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="space-y-4">
            {/* Secondary Payment Filter - Only show for "Selesai" tab */}
            {tab.value === "completed" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-4 h-4 text-blue-700" />
                  <span className="text-sm font-medium text-blue-900">
                    Filter Status Pembayaran:
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {paymentStatusTabs.map((paymentTab) => (
                    <Button
                      key={paymentTab.value}
                      variant={
                        paymentFilter === paymentTab.value
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => setPaymentFilter(paymentTab.value)}
                      className={
                        paymentFilter === paymentTab.value
                          ? "bg-blue-900 hover:bg-blue-950"
                          : "bg-white hover:bg-blue-50 text-blue-900 border-blue-200"
                      }
                    >
                      {paymentTab.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Desktop Table View */}
            <Card className="hidden md:block">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Order ID</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Perangkat</TableHead>
                      <TableHead>Teknisi</TableHead>
                      <TableHead>Status</TableHead>
                      {tab.value === "completed" && (
                        <TableHead>Pembayaran</TableHead>
                      )}
                      <TableHead className="text-right">Biaya</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredByPaymentStatus(
                      getFilteredByStatus(tab.value),
                      tab.value === "completed" ? paymentFilter : "all",
                    ).length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={tab.value === "completed" ? 8 : 7}
                          className="text-center py-8 text-zinc-500"
                        >
                          Tidak ada pesanan ditemukan
                        </TableCell>
                      </TableRow>
                    ) : (
                      getFilteredByPaymentStatus(
                        getFilteredByStatus(tab.value),
                        tab.value === "completed" ? paymentFilter : "all",
                      ).map((order) => (
                        <TableRow key={order.order_id}>
                          <TableCell className="font-mono font-medium">
                            #{order.order_id}
                          </TableCell>
                          <TableCell className="text-sm text-zinc-500">
                            {format(new Date(order.created_at), "dd MMM yyyy", {
                              locale: idLocale,
                            })}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">
                                {order.device_brand} {order.device_type}
                              </span>
                              <span className="text-xs text-zinc-500 line-clamp-1">
                                {order.problem_description}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {order.technician_name ? (
                              <Badge variant="outline" className="font-normal">
                                {order.technician_name}
                              </Badge>
                            ) : (
                              <span className="text-zinc-400 text-xs italic">
                                -
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={order.status} />
                          </TableCell>
                          {tab.value === "completed" && (
                            <TableCell>
                              {getPaymentStatusBadge(order)}
                            </TableCell>
                          )}
                          <TableCell className="text-right whitespace-nowrap">
                            {order.final_cost ? (
                              <span className="font-bold text-green-700">
                                {formatCurrency(order.final_cost)}
                              </span>
                            ) : order.cost_estimation ? (
                              <span className="text-zinc-500 text-xs">
                                Est: {formatCurrency(order.cost_estimation)}
                              </span>
                            ) : (
                              <span className="text-zinc-400 text-xs">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditClick(order)}
                            >
                              <Pencil className="h-4 w-4 text-zinc-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {getFilteredByPaymentStatus(
                getFilteredByStatus(tab.value),
                tab.value === "completed" ? paymentFilter : "all",
              ).length === 0 ? (
                <div className="text-center py-8 text-zinc-500 bg-white rounded-lg border border-zinc-200">
                  Tidak ada pesanan ditemukan
                </div>
              ) : (
                getFilteredByPaymentStatus(
                  getFilteredByStatus(tab.value),
                  tab.value === "completed" ? paymentFilter : "all",
                ).map((order) => (
                  <Card key={order.order_id} className="border-zinc-200">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex flex-row justify-between items-start">
                        <div>
                          <div className="font-bold text-lg">
                            #{order.order_id}
                          </div>
                          <div className="text-xs text-zinc-500">
                            {format(
                              new Date(order.created_at),
                              "dd MMM yyyy, HH:mm",
                              { locale: idLocale },
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 items-end">
                          <StatusBadge status={order.status} />
                          {tab.value === "completed" &&
                            getPaymentStatusBadge(order)}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="font-medium text-sm">
                          {order.device_brand} - {order.device_type}
                        </div>
                        <div className="text-xs text-zinc-600 line-clamp-2">
                          "{order.problem_description}"
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <div className="text-xs text-zinc-500">Teknisi</div>
                          <div className="font-medium">
                            {order.technician_name || "-"}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-zinc-500">Biaya</div>
                          <div className="font-medium">
                            {order.final_cost ? (
                              formatCurrency(order.final_cost)
                            ) : order.cost_estimation ? (
                              <span className="text-zinc-500 italic">
                                Est. {formatCurrency(order.cost_estimation)}
                              </span>
                            ) : (
                              "-"
                            )}
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full text-blue-900 border-blue-200 hover:bg-blue-50 justify-center"
                        onClick={() => handleEditClick(order)}
                      >
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit / Update Status
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Edit Order Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Pesanan #{selectedOrder?.order_id}</DialogTitle>
            <DialogDescription>
              Perbarui status perbaikan, teknisi, biaya, dan konfirmasi
              pembayaran.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Order Status Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-zinc-900 border-b pb-2">
                Status Perbaikan
              </h3>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  value={editForm.status}
                  onValueChange={(val: any) =>
                    setEditForm({ ...editForm, status: val })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="waiting">Menunggu</SelectItem>
                    <SelectItem value="on_progress">Diproses</SelectItem>
                    <SelectItem value="completed">Selesai</SelectItem>
                    <SelectItem value="cancelled">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="technician" className="text-right">
                  Teknisi
                </Label>
                <Input
                  id="technician"
                  className="col-span-3"
                  placeholder="Nama Teknisi"
                  value={editForm.technician_name}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      technician_name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tech_phone" className="text-right">
                  No. HP
                </Label>
                <Input
                  id="tech_phone"
                  className="col-span-3"
                  placeholder="0812..."
                  value={editForm.technician_phone}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      technician_phone: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cost_est" className="text-right">
                  Estimasi
                </Label>
                <Input
                  id="cost_est"
                  type="number"
                  className="col-span-3"
                  placeholder="Rp 0"
                  value={editForm.cost_estimation}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      cost_estimation: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="final_cost"
                  className="text-right font-bold text-blue-900"
                >
                  Biaya Final
                </Label>
                <Input
                  id="final_cost"
                  type="number"
                  className="col-span-3 bg-blue-50 border-blue-200"
                  placeholder="Rp 0 (Jika Selesai)"
                  value={editForm.final_cost}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      final_cost: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            {/* Payment Section - Only show for completed orders */}
            {selectedOrder?.status === "completed" && (
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold text-sm text-zinc-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Informasi Pembayaran
                </h3>

                {!selectedOrder.payment ? (
                  <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 text-center">
                    <XCircle className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                    <p className="text-sm text-zinc-600">
                      Belum ada pembayaran untuk order ini
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">
                      Customer belum melakukan pembayaran
                    </p>
                  </div>
                ) : selectedOrder.payment.status === "pending" ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-sm text-amber-900">
                          Menunggu Konfirmasi
                        </p>
                        <p className="text-xs text-amber-700 mt-1">
                          Payment ID: {selectedOrder.payment.payment_id}
                        </p>
                        <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                          <div>
                            <span className="text-amber-600">Metode:</span>
                            <span className="ml-1 font-medium capitalize">
                              {selectedOrder.payment.payment_method}
                            </span>
                          </div>
                          <div>
                            <span className="text-amber-600">Jumlah:</span>
                            <span className="ml-1 font-medium">
                              {formatCurrency(selectedOrder.payment.amount)}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-amber-600 mt-2">
                          Dibuat:{" "}
                          {format(
                            new Date(selectedOrder.payment.created_at),
                            "dd MMM yyyy, HH:mm",
                            { locale: idLocale },
                          )}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={handleConfirmPayment}
                      disabled={confirmingPayment}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {confirmingPayment ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Mengkonfirmasi...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Konfirmasi Pembayaran Diterima
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-sm text-green-900">
                          ✓ Pembayaran Lunas
                        </p>
                        <p className="text-xs text-green-700 mt-1">
                          Payment ID: {selectedOrder.payment.payment_id}
                        </p>
                        <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                          <div>
                            <span className="text-green-600">Metode:</span>
                            <span className="ml-1 font-medium capitalize">
                              {selectedOrder.payment.payment_method}
                            </span>
                          </div>
                          <div>
                            <span className="text-green-600">Jumlah:</span>
                            <span className="ml-1 font-medium">
                              {formatCurrency(selectedOrder.payment.amount)}
                            </span>
                          </div>
                        </div>
                        {selectedOrder.payment.paid_at && (
                          <p className="text-xs text-green-600 mt-2">
                            Dikonfirmasi:{" "}
                            {format(
                              new Date(selectedOrder.payment.paid_at),
                              "dd MMM yyyy, HH:mm",
                              { locale: idLocale },
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="bg-blue-900 hover:bg-blue-950"
              onClick={handleUpdate}
            >
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
