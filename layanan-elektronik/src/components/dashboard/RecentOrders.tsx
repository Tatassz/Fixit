import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Package } from "lucide-react";

export function RecentOrders() {
    return (
        <Card className="border-zinc-200">
            <CardHeader>
                <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Pesanan Terbaru
                </CardTitle>
                <CardDescription>Belum ada pesanan</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center py-8">
                    <Package className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
                    <p className="text-zinc-600 mb-4">
                        Anda belum memiliki pesanan
                    </p>
                    <Button className="bg-blue-900 hover:bg-blue-950">
                        Buat Pesanan Pertama
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
