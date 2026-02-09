import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { serviceService, orderService } from "@/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Wrench, Smartphone, MapPin, Image as ImageIcon } from "lucide-react";
import type { Service, CreateOrderData } from "@/types";

export default function CreateOrderPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState<{
        device_brand: string;
        device_type: string;
        problem_description: string;
        address: string;
        device_photo?: string;
    }>({
        device_brand: "",
        device_type: "",
        problem_description: "",
        address: "",
        device_photo: "",
    });

    useEffect(() => {
        if (id) {
            loadService(id);
        }
    }, [id]);

    const loadService = async (serviceId: string) => {
        try {
            const data = await serviceService.getById(serviceId);
            setService(data);
            // Pre-fill address from user profile if available in local storage?
            const userData = localStorage.getItem('user');
            if (userData) {
                const user = JSON.parse(userData);
                if (user.address) {
                    setFormData(prev => ({ ...prev, address: user.address }));
                }
            }
        } catch (error) {
            toast.error("Gagal memuat detail layanan");
            navigate('/services');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!service || !id) return;

        setSubmitting(true);

        // In mock API, service_id needed is number
        const orderData: CreateOrderData = {
            service_id: parseInt(id),
            ...formData
        };

        try {
            await orderService.create(orderData);
            toast.success("Pesanan berhasil dibuat!", {
                description: "Teknisi kami akan segera memproses pesanan Anda.",
            });
            navigate('/orders');
        } catch (error) {
            toast.error("Gagal membuat pesanan", {
                description: error instanceof Error ? error.message : "Terjadi kesalahan",
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-900" />
            </div>
        );
    }

    if (!service) return null;

    return (
        <div className="max-w-2xl mx-auto">
            <Button
                variant="ghost"
                onClick={() => navigate('/services')}
                className="mb-4 text-zinc-600 hover:text-blue-900 pl-0 hover:bg-transparent"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Layanan
            </Button>

            <div className="mb-6">
                <h2 className="text-3xl font-bold text-zinc-900">Form Pemesanan</h2>
                <p className="text-zinc-600 mt-2">
                    Lengkapi detail kerusakan perangkat Anda
                </p>
            </div>

            <Card>
                <CardHeader className="bg-blue-50/50 border-b border-blue-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <Wrench className="w-6 h-6 text-blue-700" />
                        </div>
                        <div>
                            <CardTitle className="text-lg text-blue-900">{service.name}</CardTitle>
                            <CardDescription className="text-blue-700/80">
                                Estimasi: {service.estimated_time} • Mulai Rp {service.price_start.toLocaleString('id-ID')}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <form id="order-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="device_brand">Merek Perangkat</Label>
                                <div className="relative">
                                    <Smartphone className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                                    <Input
                                        id="device_brand"
                                        placeholder="Contoh: Samsung, Asus, iPhone"
                                        value={formData.device_brand}
                                        onChange={handleChange}
                                        className="pl-9"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="device_type">Tipe/Model</Label>
                                <Input
                                    id="device_type"
                                    placeholder="Contoh: Galaxy S21, ROG Phone 5"
                                    value={formData.device_type}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="problem_description">Deskripsi Kerusakan</Label>
                            <Textarea
                                id="problem_description"
                                placeholder="Jelaskan detail kerusakan yang Anda alami..."
                                value={formData.problem_description}
                                onChange={handleChange}
                                className="min-h-[100px]"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="photo">Foto Perangkat (Opsional)</Label>
                            <div className="flex items-center gap-4">
                                <div className="relative border-2 border-dashed border-zinc-300 rounded-lg p-4 hover:bg-zinc-50 transition w-full text-center">
                                    <input
                                        type="file"
                                        id="photo"
                                        accept="image/*"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                // Simulate valid file check
                                                if (file.size > 5 * 1024 * 1024) {
                                                    alert("Ukuran foto maksimal 5MB");
                                                    return;
                                                }
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setFormData(prev => ({ ...prev, device_photo: reader.result as string }));
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                    <div className="flex flex-col items-center justify-center pointer-events-none">
                                        {formData.device_photo ? (
                                            <img src={formData.device_photo} alt="Preview" className="h-32 object-contain rounded mb-2" />
                                        ) : (
                                            <div className="p-3 bg-zinc-100 rounded-full mb-2">
                                                <ImageIcon className="h-6 w-6 text-zinc-400" />
                                            </div>
                                        )}
                                        <span className="text-sm font-medium text-zinc-600">
                                            {formData.device_photo ? "Ganti Foto" : "Klik untuk upload foto"}
                                        </span>
                                        <span className="text-xs text-zinc-400 mt-1">Maks 5MB</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Alamat Penjemputan</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                                <Textarea
                                    id="address"
                                    placeholder="Alamat lengkap lokasi perangkat..."
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="min-h-[80px] pl-9"
                                    required
                                />
                            </div>
                            <p className="text-xs text-zinc-500">Pastikan alamat akurat untuk memudahkan teknisi.</p>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="bg-zinc-50 border-t border-zinc-100 py-4 flex justify-between items-center">
                    <div className="text-sm text-zinc-500">
                        Langkah 1 dari 2
                    </div>
                    <Button
                        type="submit"
                        form="order-form"
                        className="bg-blue-900 hover:bg-blue-950 min-w-[140px]"
                        disabled={submitting}
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Memproses...
                            </>
                        ) : (
                            'Buat Pesanan'
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
