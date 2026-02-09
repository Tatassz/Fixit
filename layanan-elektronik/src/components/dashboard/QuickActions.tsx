import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, Package, CreditCard } from "lucide-react";

export function QuickActions() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-zinc-200 hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                    <CardTitle className="flex items-center text-blue-900">
                        <Wrench className="w-5 h-5 mr-2" />
                        Buat Pesanan Baru
                    </CardTitle>
                    <CardDescription>
                        Ajukan perbaikan perangkat elektronik Anda
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button className="w-full bg-blue-900 hover:bg-blue-950">
                        Mulai Pesanan
                    </Button>
                </CardContent>
            </Card>

            <Card className="border-zinc-200 hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                    <CardTitle className="flex items-center text-blue-600">
                        <Package className="w-5 h-5 mr-2" />
                        Pesanan Saya
                    </CardTitle>
                    <CardDescription>
                        Lihat status dan riwayat pesanan Anda
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="outline" className="w-full border-zinc-300">
                        Lihat Pesanan
                    </Button>
                </CardContent>
            </Card>

            <Card className="border-zinc-200 hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                    <CardTitle className="flex items-center text-purple-600">
                        <CreditCard className="w-5 h-5 mr-2" />
                        Pembayaran
                    </CardTitle>
                    <CardDescription>
                        Kelola pembayaran dan invoice
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="outline" className="w-full border-zinc-300">
                        Lihat Pembayaran
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
