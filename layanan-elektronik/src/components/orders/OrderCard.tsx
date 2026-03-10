import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  CheckCircle2,
  Clock,
  CreditCard,
  MapPin,
  Package,
  Printer,
  Wrench,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency } from "@/lib/utils";
import { OrderRatingSection } from "@/components/orders/OrderRatingSection";
import { OrderWarrantySection } from "@/components/orders/OrderWarrantySection";
import type { OrderCardState, OrderWithPayment } from "@/components/orders/types";

interface OrderCardProps {
  order: OrderWithPayment;
  state: OrderCardState;
  onPaymentClick: () => void;
  onPrintInvoice: () => void;
  onClaimDescriptionChange: (description: string) => void;
  onClaimPhotoChange: (file?: File) => void;
  onSubmitClaim: () => void;
  onRatingStarsChange: (stars: number) => void;
  onRatingReviewChange: (review: string) => void;
  onSubmitRating: () => void;
}

export function OrderCard({
  order,
  state,
  onPaymentClick,
  onPrintInvoice,
  onClaimDescriptionChange,
  onClaimPhotoChange,
  onSubmitClaim,
  onRatingStarsChange,
  onRatingReviewChange,
  onSubmitRating,
}: OrderCardProps) {
  const isPaymentApproved = order.payment?.status === "paid";
  const totalCost = order.final_cost || order.cost_estimation || 0;

  return (
    <Card className="border-zinc-200 overflow-hidden">
      <CardHeader className="bg-zinc-50 border-b border-zinc-100 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white border border-zinc-200 rounded-lg">
              <Package className="w-5 h-5 text-blue-900" />
            </div>
            <div>
              <CardTitle className="text-base">Order #{order.order_id}</CardTitle>
              <CardDescription className="text-xs">
                Dibuat pada{" "}
                {format(new Date(order.created_at), "dd MMMM yyyy, HH:mm", {
                  locale: idLocale,
                })}
              </CardDescription>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <StatusBadge status={order.status} />

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
                <p className="font-medium text-sm text-zinc-900">Detail Perangkat</p>
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
                <p className="font-medium text-sm text-zinc-900">Lokasi Penjemputan</p>
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
                    <p className="text-xs text-blue-700">{order.technician_phone}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {order.status === "completed" && (
          <div className="mt-6 pt-6 border-t border-zinc-200 space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-sm text-zinc-600">Total Biaya Perbaikan</p>
                <p className="text-2xl font-bold text-blue-900">
                  {formatCurrency(totalCost)}
                </p>
              </div>

              {!order.payment ? (
                <Button
                  onClick={onPaymentClick}
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
                <div className="flex flex-col gap-2">
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
                            ? format(new Date(order.payment.paid_at), "dd MMM yyyy", {
                                locale: idLocale,
                              })
                            : "-"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="border-blue-200 text-blue-900 hover:bg-blue-50"
                    onClick={onPrintInvoice}
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Cetak Invoice / Nota
                  </Button>
                </div>
              )}
            </div>

            {isPaymentApproved ? (
              <>
                <OrderWarrantySection
                  order={order}
                  state={state}
                  onClaimDescriptionChange={onClaimDescriptionChange}
                  onClaimPhotoChange={onClaimPhotoChange}
                  onSubmitClaim={onSubmitClaim}
                />

                <OrderRatingSection
                  state={state}
                  fallbackDate={order.updated_at}
                  onStarsChange={onRatingStarsChange}
                  onReviewChange={onRatingReviewChange}
                  onSubmitRating={onSubmitRating}
                />
              </>
            ) : (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-semibold text-amber-900">
                  Klaim Garansi & Rating Belum Aktif
                </p>
                <p className="text-xs text-amber-800 mt-1">
                  Fitur klaim customer care dan penilaian akan aktif setelah
                  pembayaran dikonfirmasi admin.
                </p>
              </div>
            )}
          </div>
        )}

        {order.status === "returned" && (
          <div className="mt-6 pt-6 border-t border-zinc-200">
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
              <p className="text-sm font-semibold text-orange-900">
                Perangkat Tidak Bisa Dibenerin (Return)
              </p>
              <p className="text-xs text-orange-800 mt-1">
                Tim kami akan menghubungi Anda untuk proses pengembalian perangkat
                dan tindak lanjut customer care.
              </p>
            </div>
          </div>
        )}

        {order.status === "on_progress" && order.cost_estimation && (
          <div className="mt-6 pt-6 border-t border-zinc-200">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800 font-medium">Estimasi Biaya</p>
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
  );
}
