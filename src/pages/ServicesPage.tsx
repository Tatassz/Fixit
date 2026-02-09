import { useEffect, useState } from "react";
import { serviceService } from "@/services";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Loader2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/lib/utils";
import type { Service } from "@/types";

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        try {
            const data = await serviceService.getAll();
            setServices(data || []);
        } catch (error) {
            console.error('Failed to load services:', error);
        } finally {
            setLoading(false);
        }
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
                <h2 className="text-3xl font-bold text-zinc-900">Layanan Kami</h2>
                <p className="text-zinc-600 mt-2">
                    Pilih layanan perbaikan yang sesuai dengan kebutuhan Anda
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                    <Card key={service.id} className="flex flex-col h-full hover:shadow-lg transition-shadow border-zinc-200">
                        <CardHeader>
                            <div className="flex justify-between items-start mb-2">
                                <StatusBadge status={service.status} />
                            </div>
                            <CardTitle className="text-xl">{service.name}</CardTitle>
                            <CardDescription className="line-clamp-2 mt-2">
                                {service.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-500">Estimasi Biaya:</span>
                                    <span className="font-semibold text-blue-900">
                                        Mulai {formatCurrency(service.price_start)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-500">Estimasi Waktu:</span>
                                    <span className="font-medium text-zinc-900">{service.estimated_time}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full bg-blue-900 hover:bg-blue-950"
                                disabled={service.status !== 'active'}
                                onClick={() => navigate(`/services/${service.id}/order`)}
                            >
                                Pesan Sekarang <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}

                {services.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-white rounded-lg border border-dashed border-zinc-300">
                        <p className="text-zinc-500">Belum ada layanan yang tersedia saat ini.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
