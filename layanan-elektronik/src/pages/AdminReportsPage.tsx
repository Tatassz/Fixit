import { useEffect, useMemo, useState } from "react";
import { adminService, orderService } from "@/services";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Download,
  FileText,
  TrendingUp,
  PieChart,
  Printer,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { ReportData } from "@/types";
import { toast } from "sonner";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export default function AdminReportsPage() {
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [returnedCount, setReturnedCount] = useState(0);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      const [reportData, allOrders] = await Promise.all([
        adminService.getReports(),
        orderService.getAll(),
      ]);

      setReport(reportData);
      setReturnedCount(
        allOrders.filter((order) => order.status === "returned").length,
      );
    } catch (error) {
      console.error("Failed to load reports:", error);
      toast.error("Gagal memuat laporan");
    } finally {
      setLoading(false);
    }
  };

  const generatedAt = useMemo(
    () => format(new Date(), "dd MMMM yyyy, HH:mm", { locale: idLocale }),
    [],
  );

  const handlePrintReport = () => {
    if (!report) return;

    const printWindow = window.open("", "_blank", "width=960,height=720");
    if (!printWindow) {
      toast.error("Gagal membuka jendela cetak");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Laporan Keuangan FixIt</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 24px; color: #0f172a; }
          h1 { margin: 0; color: #1e3a8a; font-size: 24px; }
          .subtitle { margin-top: 4px; font-size: 13px; color: #475569; }
          .section { margin-top: 20px; border: 1px solid #dbeafe; border-radius: 10px; overflow: hidden; }
          .section-title { background: #eff6ff; padding: 10px 14px; font-weight: 700; font-size: 13px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 10px 14px; border-top: 1px solid #e2e8f0; font-size: 13px; text-align: left; }
          th { background: #f8fafc; color: #334155; }
          .text-right { text-align: right; }
          .total { font-size: 18px; font-weight: 700; color: #1e3a8a; }
        </style>
      </head>
      <body>
        <h1>Laporan Keuangan & Operasional FixIt</h1>
        <p class="subtitle">Dicetak pada: ${escapeHtml(generatedAt)}</p>

        <div class="section">
          <div class="section-title">Ringkasan Status Pesanan</div>
          <table>
            <tbody>
              <tr><td>Total Pesanan</td><td class="text-right"><strong>${report.orders_summary.total}</strong></td></tr>
              <tr><td>Selesai</td><td class="text-right">${report.orders_summary.completed}</td></tr>
              <tr><td>Diproses</td><td class="text-right">${report.orders_summary.on_progress}</td></tr>
              <tr><td>Menunggu</td><td class="text-right">${report.orders_summary.waiting}</td></tr>
              <tr><td>Return</td><td class="text-right">${returnedCount}</td></tr>
              <tr><td>Dibatalkan</td><td class="text-right">${report.orders_summary.cancelled}</td></tr>
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="section-title">Pendapatan per Layanan</div>
          <table>
            <thead>
              <tr>
                <th>Layanan</th>
                <th class="text-right">Order Selesai</th>
                <th class="text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              ${report.revenue_by_service
                .map(
                  (item) => `
                    <tr>
                      <td>${escapeHtml(item.service_name)}</td>
                      <td class="text-right">${item.total_orders}</td>
                      <td class="text-right">${escapeHtml(formatCurrency(item.revenue))}</td>
                    </tr>
                  `,
                )
                .join("")}
              <tr>
                <td colspan="2" class="text-right"><strong>Total Pendapatan</strong></td>
                <td class="text-right total">${escapeHtml(
                  formatCurrency(report.total_revenue),
                )}</td>
              </tr>
            </tbody>
          </table>
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

  const handleDownloadExcel = () => {
    if (!report) return;

    const headerRow = ["Kategori", "Nilai"];
    const statusRows = [
      ["Total Pesanan", report.orders_summary.total],
      ["Selesai", report.orders_summary.completed],
      ["Diproses", report.orders_summary.on_progress],
      ["Menunggu", report.orders_summary.waiting],
      ["Return", returnedCount],
      ["Dibatalkan", report.orders_summary.cancelled],
    ];

    const revenueRows = report.revenue_by_service.map((item) => [
      item.service_name,
      item.total_orders,
      item.revenue,
    ]);

    const workbookHtml = `
      <html>
      <head>
        <meta charset="utf-8" />
      </head>
      <body>
        <table border="1">
          <tr><th colspan="2">Laporan Status Pesanan</th></tr>
          <tr><td>Generated At</td><td>${generatedAt}</td></tr>
          <tr><td colspan="2"></td></tr>
          <tr><th>${headerRow[0]}</th><th>${headerRow[1]}</th></tr>
          ${statusRows
            .map((row) => `<tr><td>${row[0]}</td><td>${row[1]}</td></tr>`)
            .join("")}
        </table>
        <br />
        <table border="1">
          <tr><th colspan="3">Pendapatan per Layanan</th></tr>
          <tr><th>Layanan</th><th>Order Selesai</th><th>Revenue</th></tr>
          ${revenueRows
            .map(
              (row) =>
                `<tr><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td></tr>`,
            )
            .join("")}
          <tr><td colspan="2"><strong>Total Pendapatan</strong></td><td><strong>${report.total_revenue}</strong></td></tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([workbookHtml], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const fileDate = format(new Date(), "yyyy-MM-dd");

    link.href = url;
    link.download = `laporan-fixit-${fileDate}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Laporan Excel berhasil diunduh");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-900" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-12 text-zinc-500">
        Data laporan tidak tersedia.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900">Laporan & Analitik</h2>
          <p className="text-zinc-600">
            Ringkasan performa bisnis dan statistik pesanan
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handlePrintReport} className="gap-2">
            <Printer className="w-4 h-4" />
            Print Laporan
          </Button>
          <Button onClick={handleDownloadExcel} className="gap-2 bg-green-700 hover:bg-green-800">
            <Download className="w-4 h-4" />
            Export Excel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-900" />
              Ringkasan Pendapatan per Layanan
            </CardTitle>
            <CardDescription>
              Breakdown pendapatan berdasarkan jenis layanan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {report.revenue_by_service.map((item) => (
                <div
                  key={item.service_id}
                  className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg border border-zinc-100"
                >
                  <div>
                    <div className="font-medium text-zinc-900">{item.service_name}</div>
                    <div className="text-sm text-zinc-500">
                      {item.total_orders} pesanan selesai
                    </div>
                  </div>
                  <div className="font-bold text-green-700">
                    {formatCurrency(item.revenue)}
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100 mt-4">
                <div className="font-bold text-blue-900">Total Pendapatan</div>
                <div className="font-bold text-xl text-blue-900">
                  {formatCurrency(report.total_revenue)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-900" />
              Status Pesanan
            </CardTitle>
            <CardDescription>Distribusi status semua pesanan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-zinc-600">Total Pesanan</span>
                <span className="font-bold text-lg">{report.orders_summary.total}</span>
              </div>
              <div className="h-px bg-zinc-200 my-2"></div>
              <div className="flex justify-between items-center">
                <span className="text-green-600 font-medium">Selesai</span>
                <span className="font-bold">{report.orders_summary.completed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-600 font-medium">Diproses</span>
                <span className="font-bold">{report.orders_summary.on_progress}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-yellow-600 font-medium">Menunggu</span>
                <span className="font-bold">{report.orders_summary.waiting}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-orange-600 font-medium">Return</span>
                <span className="font-bold">{returnedCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-red-600 font-medium">Dibatalkan</span>
                <span className="font-bold">{report.orders_summary.cancelled}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-xs text-zinc-500 flex items-center gap-2">
        <FileText className="w-3.5 h-3.5" />
        Data terakhir diperbarui saat halaman dibuka: {generatedAt}
      </div>
    </div>
  );
}
