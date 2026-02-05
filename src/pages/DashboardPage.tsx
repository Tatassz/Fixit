import { useNavigate, useOutletContext } from "react-router-dom";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { Button } from "@/components/ui/button";
import { User as UserIcon, ArrowRight } from "lucide-react";
import type { User } from "@/types";

export default function DashboardPage() {
    const navigate = useNavigate();
    const { user } = useOutletContext<{ user: User }>();

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-zinc-900">
                        Selamat datang, {user.name.split(' ')[0]}! 👋
                    </h2>
                    <p className="text-zinc-600 mt-2">
                        Apa yang ingin Anda lakukan hari ini?
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => navigate('/services')}
                    className="md:w-auto w-full"
                >
                    Lihat Layanan Tersedia <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </div>

            <div className="grid gap-6">
                {/* Helper Card for Profile incomplete */}
                {(!user.phone || !user.address) && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-4">
                        <div className="p-2 bg-yellow-100 rounded-full">
                            <UserIcon className="w-5 h-5 text-yellow-700" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-yellow-900">Lengkapi Profil Anda</h4>
                            <p className="text-sm text-yellow-800 mt-1">
                                Agar teknisi dapat menemukan lokasi Anda dengan mudah, mohon lengkapi data profil Anda.
                            </p>
                            <Button
                                variant="link"
                                onClick={() => navigate('/profile')}
                                className="text-yellow-900 px-0 mt-2 h-auto font-medium hover:text-yellow-950 underline"
                            >
                                Lengkapi Sekarang
                            </Button>
                        </div>
                    </div>
                )}

                <QuickActions />
                <RecentOrders />
            </div>
        </div>
    );
}
