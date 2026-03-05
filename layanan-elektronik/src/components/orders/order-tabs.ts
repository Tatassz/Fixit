import type { OrderWithPayment } from "@/components/orders/types";

export const ORDER_TABS = [
  { value: "all", label: "Semua", filter: () => true },
  { value: "waiting", label: "Menunggu", filter: (o: OrderWithPayment) => o.status === "waiting" },
  { value: "on_progress", label: "Diproses", filter: (o: OrderWithPayment) => o.status === "on_progress" },
  { value: "completed", label: "Selesai", filter: (o: OrderWithPayment) => o.status === "completed" },
  { value: "returned", label: "Return", filter: (o: OrderWithPayment) => o.status === "returned" },
  { value: "cancelled", label: "Dibatalkan", filter: (o: OrderWithPayment) => o.status === "cancelled" },
];
