import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { authService, userService } from "@/services";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import type { User } from "@/types";

export function DashboardLayout() {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = authService.getToken();
        if (!token) {
            navigate('/login');
            return;
        }

        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
            } catch (error) {
                console.error('Error parsing user data:', error);
                navigate('/login');
            }
        } else {
            // Fallback: fetch profile from API
            userService.getProfile()
                .then(u => setUser(u))
                .catch(() => navigate('/login'));
        }
        setLoading(false);
    }, [navigate]);

    const handleLogout = () => {
        authService.clearToken();
        localStorage.removeItem('user');
        navigate('/login');
    };

    const toggleSidebarCollapse = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
                    <p className="mt-4 text-zinc-600">Memuat...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-zinc-50 flex">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                userRole={user.role}
                isCollapsed={sidebarCollapsed}
                toggleCollapse={toggleSidebarCollapse}
            />

            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                <Topbar
                    onMenuClick={() => setSidebarOpen(true)}
                    onLogout={handleLogout}
                    userName={user.name}
                />

                <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
                    <Outlet context={{ user }} />
                </main>
            </div>
        </div>
    );
}
