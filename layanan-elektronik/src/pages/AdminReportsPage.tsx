import { useEffect, useState } from "react";
import { adminService } from "@/services";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Download, FileText, TrendingUp, PieChart } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { ReportData } from "@/types";
import { toast } from "sonner";

export default function AdminReportsPage() {
    const [report, setReport] = useState<ReportData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReport();
    }, []);

    const loadReport = async () => {
        try {
            const data = await adminService.getReports();
            setReport(data);
        } catch (error) {
            console.error('Failed to load reports:', error);
            toast.error("Gagal memuat laporan");
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = () => {
        toast.info("Fitur download PDF sedang dalam pengembangan");
    };

    const handleDownloadExcel = () => {
        toast.info("Fitur download Excel sedang dalam pengembangan");
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
                    <p className="text-zinc-600">Ringkasan performa bisnis dan statistik pesanan</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleDownloadPDF} className="gap-2">
                        <FileText className="w-4 h-4" />
                        Export PDF
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
                        <CardDescription>Breakdown pendapatan berdasarkan jenis layanan</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {report.revenue_by_service.map((item) => (
                                <div key={item.service_id} className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                                    <div>
                                        <div className="font-medium text-zinc-900">{item.service_name}</div>
                                        <div className="text-sm text-zinc-500">{item.total_orders} pesanan selesai</div>
                                    </div>
                                    <div className="font-bold text-green-700">
                                        {formatCurrency(item.revenue)}
                                    </div>
                                </div>
                            ))}
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100 mt-4">
                                <div className="font-bold text-blue-900">Total Pendapatan</div>
                                <div className="font-bold text-xl text-blue-900">{formatCurrency(report.total_revenue)}</div>
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
                                <span className="text-red-600 font-medium">Dibatalkan</span>
                                <span className="font-bold">{report.orders_summary.cancelled}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
