import { useEffect, useMemo, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Loader2,
  Search,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import type { Order, Payment } from "@/types";

type PaymentStatusFilter = "all" | "none" | "pending" | "paid";

interface PaymentRow {
  order: Order;
  payment: Payment | null;
  paymentStatus: Exclude<PaymentStatusFilter, "all">;
}

export default function AdminPaymentsPage() {
  const [rows, setRows] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmingPaymentId, setConfirmingPaymentId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const allOrders = await orderService.getAll();
      const completedOrders = allOrders.filter((order) => order.status === "completed");

      const paymentRows = await Promise.all(
        completedOrders.map(async (order) => {
          try {
            const payments = await paymentService.getByOrder(order.order_id.toString());
            const latestPayment = payments && payments.length > 0 ? payments[0] : null;

            return {
              order,
              payment: latestPayment,
              paymentStatus: (latestPayment
                ? latestPayment.status === "paid"
                  ? "paid"
                  : "pending"
                : "none") as PaymentRow["paymentStatus"],
            };
          } catch {
            return {
              order,
              payment: null,
              paymentStatus: "none" as const,
            };
          }
        }),
      );

      paymentRows.sort(
        (a, b) =>
          new Date(b.order.created_at).getTime() -
          new Date(a.order.created_at).getTime(),
      );
      setRows(paymentRows);
    } catch (error) {
      console.error("Failed to load payment management data:", error);
      toast.error("Gagal memuat data pembayaran");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async (row: PaymentRow) => {
    if (!row.payment || row.payment.status !== "pending") return;

    setConfirmingPaymentId(row.payment.payment_id);
    try {
      await paymentService.confirm(row.payment.payment_id);
      toast.success("Pembayaran berhasil dikonfirmasi");
      await loadPayments();
    } catch (error) {
      console.error("Failed to confirm payment:", error);
      toast.error("Gagal mengkonfirmasi pembayaran");
    } finally {
      setConfirmingPaymentId(null);
    }
  };

  const filteredRows = useMemo(() => {
    const keyword = searchTerm.toLowerCase();
    return rows.filter((row) => {
      return (
        row.order.order_id.toString().includes(keyword) ||
        row.order.device_brand.toLowerCase().includes(keyword) ||
        row.order.device_type.toLowerCase().includes(keyword) ||
        (row.payment?.payment_id || "").toLowerCase().includes(keyword)
      );
    });
  }, [rows, searchTerm]);

  const tabs: Array<{ value: PaymentStatusFilter; label: string }> = [
    { value: "all", label: "Semua" },
    { value: "none", label: "Belum Bayar" },
    { value: "pending", label: "Pending" },
    { value: "paid", label: "Lunas" },
  ];

  const filterByPaymentStatus = (
    items: PaymentRow[],
    paymentStatus: PaymentStatusFilter,
  ) => {
    if (paymentStatus === "all") return items;
    return items.filter((item) => item.paymentStatus === paymentStatus);
  };

  const renderPaymentBadge = (row: PaymentRow) => {
    if (row.paymentStatus === "none") {
      return (
        <Badge variant="outline" className="bg-zinc-50 text-zinc-600 border-zinc-300">
          <XCircle className="w-3 h-3 mr-1" />
          Belum Dibayar
        </Badge>
      );
    }

    if (row.paymentStatus === "pending") {
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
        <div>
          <h2 className="text-3xl font-bold text-zinc-900">List Pembayaran</h2>
          <p className="text-zinc-600">
            Halaman khusus admin untuk acc pembayaran customer
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
          <Input
            type="search"
            className="pl-9"
            placeholder="Cari order, device, payment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-zinc-100 p-1 mb-4 h-auto flex flex-wrap gap-1 w-full justify-start">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="px-4 py-2">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => {
          const currentRows = filterByPaymentStatus(filteredRows, tab.value);

          return (
            <TabsContent key={tab.value} value={tab.value} className="space-y-4">
              <Card className="hidden md:block border-zinc-200">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order</TableHead>
                        <TableHead>Perangkat</TableHead>
                        <TableHead>Status Order</TableHead>
                        <TableHead>Status Bayar</TableHead>
                        <TableHead>Nominal</TableHead>
                        <TableHead>Payment ID</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentRows.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-zinc-500">
                            Tidak ada data pembayaran
                          </TableCell>
                        </TableRow>
                      ) : (
                        currentRows.map((row) => (
                          <TableRow key={row.order.order_id}>
                            <TableCell className="font-medium">#{row.order.order_id}</TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium text-sm">
                                  {row.order.device_brand} {row.order.device_type}
                                </span>
                                <span className="text-xs text-zinc-500">
                                  {format(new Date(row.order.created_at), "dd MMM yyyy", {
                                    locale: idLocale,
                                  })}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={row.order.status} />
                            </TableCell>
                            <TableCell>{renderPaymentBadge(row)}</TableCell>
                            <TableCell>
                              {formatCurrency(
                                row.payment?.amount ||
                                  row.order.final_cost ||
                                  row.order.cost_estimation ||
                                  0,
                              )}
                            </TableCell>
                            <TableCell className="font-mono text-xs text-zinc-600">
                              {row.payment?.payment_id || "-"}
                            </TableCell>
                            <TableCell className="text-right">
                              {row.payment?.status === "pending" ? (
                                <Button
                                  size="sm"
                                  onClick={() => handleConfirmPayment(row)}
                                  disabled={confirmingPaymentId === row.payment.payment_id}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  {confirmingPaymentId === row.payment.payment_id ? (
                                    <>
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                      Meng-ACC...
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle2 className="w-4 h-4 mr-2" />
                                      ACC Pembayaran
                                    </>
                                  )}
                                </Button>
                              ) : (
                                <span className="text-xs text-zinc-500">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <div className="md:hidden space-y-3">
                {currentRows.length === 0 ? (
                  <Card className="border-zinc-200">
                    <CardContent className="py-8 text-center text-zinc-500">
                      Tidak ada data pembayaran
                    </CardContent>
                  </Card>
                ) : (
                  currentRows.map((row) => (
                    <Card key={`mobile-${row.order.order_id}`} className="border-zinc-200">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-zinc-900">
                              Order #{row.order.order_id}
                            </p>
                            <p className="text-xs text-zinc-500">
                              {format(
                                new Date(row.order.created_at),
                                "dd MMM yyyy, HH:mm",
                                { locale: idLocale },
                              )}
                            </p>
                          </div>
                          {renderPaymentBadge(row)}
                        </div>

                        <div>
                          <p className="text-sm font-medium text-zinc-900">
                            {row.order.device_brand} - {row.order.device_type}
                          </p>
                          <p className="text-xs text-zinc-500 mt-1">
                            Payment ID: {row.payment?.payment_id || "-"}
                          </p>
                        </div>

                        <div className="flex justify-between items-center border-t pt-3">
                          <div>
                            <p className="text-xs text-zinc-500">Nominal</p>
                            <p className="font-semibold text-blue-900">
                              {formatCurrency(
                                row.payment?.amount ||
                                  row.order.final_cost ||
                                  row.order.cost_estimation ||
                                  0,
                              )}
                            </p>
                          </div>

                          {row.payment?.status === "pending" && (
                            <Button
                              size="sm"
                              onClick={() => handleConfirmPayment(row)}
                              disabled={confirmingPaymentId === row.payment.payment_id}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {confirmingPaymentId === row.payment.payment_id ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  ACC...
                                </>
                              ) : (
                                <>
                                  <CreditCard className="w-4 h-4 mr-2" />
                                  ACC
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
