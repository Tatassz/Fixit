import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Package } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { afterSalesService, orderService, paymentService } from "@/services";
import { printInvoice } from "@/lib/invoice";
import { OrderCard } from "@/components/orders/OrderCard";
import { PaymentDialog } from "@/components/orders/PaymentDialog";
import { resolveStoredUserName } from "@/components/orders/helpers";
import { ORDER_TABS } from "@/components/orders/order-tabs";
import type { OrderRating, WarrantyClaim } from "@/types";
import type {
  ClaimFormState,
  OrderCardState,
  OrderWithPayment,
  RatingFormState,
} from "@/components/orders/types";
import { type PaymentMethodValue } from "@/data/payment-methods";
export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderWithPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithPayment | null>(
    null,
  );
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethodValue>("transfer");
  const [creatingPayment, setCreatingPayment] = useState(false);
  const [claimsByOrder, setClaimsByOrder] = useState<
    Record<number, WarrantyClaim[]>
  >({});
  const [ratingsByOrder, setRatingsByOrder] = useState<
    Record<number, OrderRating | null>
  >({});
  const [claimFormByOrder, setClaimFormByOrder] = useState<
    Record<number, ClaimFormState>
  >({});
  const [ratingFormByOrder, setRatingFormByOrder] = useState<
    Record<number, RatingFormState>
  >({});

  const [submittingClaimFor, setSubmittingClaimFor] = useState<number | null>(
    null,
  );
  const [submittingRatingFor, setSubmittingRatingFor] = useState<number | null>(
    null,
  );

  useEffect(() => {
    loadOrders();
  }, []);

  const hydrateAfterSalesData = (items: OrderWithPayment[]) => {
    const nextClaimMap: Record<number, WarrantyClaim[]> = {};
    const nextRatingMap: Record<number, OrderRating | null> = {};

    items.forEach((order) => {
      nextClaimMap[order.order_id] = afterSalesService.getClaimsByOrder(
        order.order_id,
      );
      nextRatingMap[order.order_id] = afterSalesService.getRatingByOrder(
        order.order_id,
      );
    });
    setClaimsByOrder(nextClaimMap);
    setRatingsByOrder(nextRatingMap);
  };

  const loadOrders = async () => {
    try {
      const data = await orderService.getMyOrders();
      const ordersWithPayments = await Promise.all(
        data.map(async (order) => {
          if (order.status !== "completed") {
            return { ...order, payment: null };
          }

          try {
            const payments = await paymentService.getByOrder(
              order.order_id.toString(),
            );
            return {
              ...order,
              payment: payments && payments.length > 0 ? payments[0] : null,
            };
          } catch {
            return { ...order, payment: null };
          }
        }),
      );

      setOrders(ordersWithPayments || []);
      hydrateAfterSalesData(ordersWithPayments || []);
    } catch (error) {
      console.error("Failed to load orders:", error);
      toast.error("Gagal memuat daftar pesanan");
    } finally {
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
      await loadOrders();
    } catch (error) {
      console.error("Failed to create payment:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal membuat pembayaran",
      );
    } finally {
      setCreatingPayment(false);
    }
  };

  const updateClaimForm = (orderId: number, payload: Partial<ClaimFormState>) => {
    setClaimFormByOrder((prevForm) => ({
      ...prevForm,
      [orderId]: {
        description: prevForm[orderId]?.description || "",
        photo: prevForm[orderId]?.photo,
        ...payload,
      },
    }));
  };

  const handleClaimPhotoUpload = (orderId: number, file?: File) => {
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran foto klaim maksimal 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      updateClaimForm(orderId, { photo: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitClaim = async (order: OrderWithPayment) => {
    if (order.payment?.status !== "paid") {
      toast.error("Klaim garansi aktif setelah pembayaran dikonfirmasi admin");
      return;
    }

    const claimForm = claimFormByOrder[order.order_id];
    if (!claimForm?.description?.trim()) {
      toast.error("Deskripsi klaim wajib diisi");
      return;
    }

    const warranty = afterSalesService.ensureWarrantyForOrder(order);
    if (!afterSalesService.isWarrantyRecordActive(warranty)) {
      toast.error("Masa garansi order ini sudah habis");
      return;
    }

    setSubmittingClaimFor(order.order_id);
    try {
      const nextClaim = afterSalesService.submitClaim({
        order_id: order.order_id,
        user_id: order.user_id,
        description: claimForm.description,
        photo: claimForm.photo,
      });

      setClaimsByOrder((prevClaims) => ({
        ...prevClaims,
        [order.order_id]: [nextClaim, ...(prevClaims[order.order_id] || [])],
      }));

      setClaimFormByOrder((prevForm) => ({
        ...prevForm,
        [order.order_id]: { description: "", photo: "" },
      }));

      toast.success("Klaim garansi berhasil dikirim");
    } catch (error) {
      console.error("Failed to submit warranty claim:", error);
      toast.error("Gagal mengirim klaim garansi");
    } finally {
      setSubmittingClaimFor(null);
    }
  };

  const updateRatingForm = (
    orderId: number,
    payload: Partial<RatingFormState>,
  ) => {
    setRatingFormByOrder((prevForm) => ({
      ...prevForm,
      [orderId]: {
        stars: prevForm[orderId]?.stars || 0,
        review: prevForm[orderId]?.review || "",
        ...payload,
      },
    }));
  };

  const handleSubmitRating = async (order: OrderWithPayment) => {
    if (order.payment?.status !== "paid") {
      toast.error("Penilaian aktif setelah pembayaran dikonfirmasi admin");
      return;
    }

    const ratingForm = ratingFormByOrder[order.order_id];
    const stars = ratingForm?.stars || 0;
    if (stars < 1) {
      toast.error("Pilih jumlah bintang terlebih dahulu");
      return;
    }

    setSubmittingRatingFor(order.order_id);
    try {
      const savedRating = afterSalesService.upsertRating({
        order_id: order.order_id,
        user_id: order.user_id,
        user_name: resolveStoredUserName(order.user_id),
        stars,
        review: ratingForm?.review || "",
        service_name: order.service_name,
      });

      setRatingsByOrder((prevRatings) => ({
        ...prevRatings,
        [order.order_id]: savedRating,
      }));

      toast.success("Terima kasih! Penilaian Anda sudah tersimpan");
    } catch (error) {
      console.error("Failed to save rating:", error);
      toast.error("Gagal menyimpan penilaian");
    } finally {
      setSubmittingRatingFor(null);
    }
  };

  const handlePrintInvoice = (order: OrderWithPayment) => {
    if (!order.payment || order.payment.status !== "paid") {
      toast.error("Invoice hanya bisa dicetak untuk pembayaran lunas");
      return;
    }

    const result = printInvoice(order, order.payment);
    if (!result.ok && result.error) {
      toast.error(result.error);
    }
  };

  const getOrderCardState = (order: OrderWithPayment): OrderCardState => {
    const isPaymentApproved = order.payment?.status === "paid";
    const warranty = afterSalesService.getEffectiveWarranty(order, isPaymentApproved);

    return {
      warranty,
      isWarrantyActive: afterSalesService.isWarrantyRecordActive(warranty),
      claims: claimsByOrder[order.order_id] || [],
      claimForm: claimFormByOrder[order.order_id],
      rating: ratingsByOrder[order.order_id] || null,
      ratingForm: ratingFormByOrder[order.order_id],
      submittingClaim: submittingClaimFor === order.order_id,
      submittingRating: submittingRatingFor === order.order_id,
    };
  };

  const renderOrderList = (filteredOrders: OrderWithPayment[]) => {
    if (filteredOrders.length === 0) {
      return (
        <div className="text-center py-16 bg-white rounded-lg border border-dashed border-zinc-300">
          <Package className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-zinc-900">Tidak ada pesanan</h3>
          <p className="text-zinc-500 mt-1 mb-6">
            Tidak ada pesanan dalam kategori ini.
          </p>
          <Button
            variant="outline"
            className="text-blue-900 border-blue-200 hover:bg-blue-50"
            onClick={() => navigate("/services")}
          >
            Buat Pesanan Baru
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const orderState = getOrderCardState(order);

          return (
            <OrderCard
              key={order.order_id}
              order={order}
              state={orderState}
              onPaymentClick={() => handlePaymentClick(order)}
              onPrintInvoice={() => handlePrintInvoice(order)}
              onClaimDescriptionChange={(description) =>
                updateClaimForm(order.order_id, { description })
              }
              onClaimPhotoChange={(file) =>
                handleClaimPhotoUpload(order.order_id, file)
              }
              onSubmitClaim={() => handleSubmitClaim(order)}
              onRatingStarsChange={(stars) =>
                updateRatingForm(order.order_id, { stars })
              }
              onRatingReviewChange={(review) =>
                updateRatingForm(order.order_id, { review })
              }
              onSubmitRating={() => handleSubmitRating(order)}
            />
          );
        })}
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
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-zinc-900">Pesanan Saya</h2>
        <p className="text-zinc-600 mt-2">
          Riwayat dan status perbaikan perangkat elektronik Anda
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 bg-zinc-100 p-1 mb-8 gap-0 h-auto">
          {ORDER_TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:bg-white data-[state=active]:text-blue-900 data-[state=active]:shadow-sm py-2.5"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {ORDER_TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-0">
            {renderOrderList(orders.filter(tab.filter))}
          </TabsContent>
        ))}
      </Tabs>

      <PaymentDialog
        open={isPaymentDialogOpen}
        selectedOrder={selectedOrder}
        paymentMethod={paymentMethod}
        creatingPayment={creatingPayment}
        onOpenChange={setIsPaymentDialogOpen}
        onPaymentMethodChange={setPaymentMethod}
        onConfirm={handleCreatePayment}
      />
    </div>
  );
}
