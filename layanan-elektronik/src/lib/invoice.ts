import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import invoiceTemplate from "@/templates/invoice-template.html?raw";
import { formatCurrency } from "@/lib/utils";
import type { Payment } from "@/types";

interface PrintableOrder {
  order_id: number;
  service_name?: string;
  device_brand: string;
  device_type: string;
  technician_name?: string;
  final_cost?: number;
  cost_estimation?: number;
}

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const replaceTemplate = (template: string, variables: Record<string, string>) =>
  Object.entries(variables).reduce(
    (html, [key, value]) => html.replaceAll(`{{${key}}}`, value),
    template,
  );

const buildInvoiceHtml = (order: PrintableOrder, payment: Payment): string => {
  const paidDate = payment.paid_at || payment.created_at;
  const totalAmount =
    order.final_cost || order.cost_estimation || payment.amount || 0;

  return replaceTemplate(invoiceTemplate, {
    INVOICE_TITLE: escapeHtml(`Invoice ${payment.payment_id}`),
    PAYMENT_ID: escapeHtml(payment.payment_id),
    PAID_AT: escapeHtml(
      format(new Date(paidDate), "dd MMMM yyyy, HH:mm", { locale: idLocale }),
    ),
    ORDER_ID: String(order.order_id),
    SERVICE_NAME: escapeHtml(order.service_name || "Perbaikan Elektronik"),
    DEVICE_LABEL: escapeHtml(`${order.device_brand} - ${order.device_type}`),
    TECHNICIAN_NAME: escapeHtml(order.technician_name || "-"),
    PAYMENT_METHOD: escapeHtml(payment.payment_method),
    TOTAL_AMOUNT: escapeHtml(formatCurrency(totalAmount)),
  });
};

export const printInvoice = (
  order: PrintableOrder,
  payment: Payment,
): { ok: boolean; error?: string } => {
  const printWindow = window.open("", "_blank", "width=900,height=720");

  if (!printWindow) {
    return { ok: false, error: "Gagal membuka jendela cetak" };
  }

  printWindow.document.write(buildInvoiceHtml(order, payment));
  printWindow.document.close();

  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
  }, 250);

  return { ok: true };
};
