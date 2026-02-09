import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { adminService } from "@/services";
import { AdminStatsCards } from "@/components/admin/AdminStatsCards";
import { AdminRecentActivity } from "@/components/admin/AdminRecentActivity";
import type { User, DashboardStats } from "@/types";

export default function AdminDashboardPage() {
    const navigate = useNavigate();
    const { user } = useOutletContext<{ user: User }>();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user.role !== 'admin') {
            navigate('/dashboard');
            return;
        }
        loadDashboardStats();
    }, [user, navigate]);

    const loadDashboardStats = async () => {
        try {
            const data = await adminService.getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error('Error loading dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !stats) {
        // Optional: show loading state for stats specifically, though layout handles main loading
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-zinc-900">Admin Dashboard</h2>
                <p className="text-zinc-600 mt-2">
                    Kelola semua aspek layanan perbaikan elektronik
                </p>
            </div>

            {stats && <AdminStatsCards stats={stats} />}
            <AdminRecentActivity />
        </div>
    );
}
