import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Package,
    Wrench,
    Users,
    CreditCard,
    FileText,
    Star,
    Settings,
    X,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    userRole?: string;
    isCollapsed: boolean;
    toggleCollapse: () => void;
}

interface NavItem {
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    roles?: string[];
}

const navItems: NavItem[] = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        roles: ["user"],
    },
    {
        title: "Dashboard Admin",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
        roles: ["admin"],
    },
    {
        title: "Pesanan Saya",
        href: "/orders",
        icon: Package,
        roles: ["user"],
    },
    {
        title: "Layanan",
        href: "/services",
        icon: Wrench,
        roles: ["user"],
    },
    {
        title: "Pembayaran",
        href: "/payments",
        icon: CreditCard,
        roles: ["user"],
    },
    {
        title: "Kelola Pesanan",
        href: "/admin/orders",
        icon: Package,
        roles: ["admin"],
    },
    {
        title: "Kelola User",
        href: "/admin/users",
        icon: Users,
        roles: ["admin"],
    },
    {
        title: "List Pembayaran",
        href: "/admin/payments",
        icon: CreditCard,
        roles: ["admin"],
    },
    {
        title: "Laporan",
        href: "/admin/reports",
        icon: FileText,
        roles: ["admin"],
    },
    {
        title: "Testimoni",
        href: "/admin/testimonials",
        icon: Star,
        roles: ["admin"],
    },
    {
        title: "Pengaturan",
        href: "/settings",
        icon: Settings,
    },
];

export function Sidebar({ isOpen, onClose, userRole, isCollapsed, toggleCollapse }: SidebarProps) {
    const location = useLocation();

    const filteredNavItems = navItems.filter(item => {
        const currentRole = userRole || "user";
        if (!item.roles) return true;
        return item.roles.includes(currentRole);
    });

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={cn(
                    "fixed top-0 left-0 z-50 h-screen bg-white border-r border-zinc-200 transition-all duration-300 lg:sticky lg:top-0",
                    isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
                    isCollapsed ? "lg:w-20" : "lg:w-64",
                    "w-64"
                )}
            >
                <div className="flex flex-col h-full">
                    <div className={cn(
                        "flex items-center p-4 border-b border-zinc-200 h-16",
                        isCollapsed ? "justify-center" : "justify-between"
                    )}>
                        <div className={cn("flex items-center", isCollapsed ? "" : "space-x-3")}>
                            <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Wrench className="w-5 h-5 text-white" />
                            </div>
                            {!isCollapsed && (
                                <h1 className="text-xl font-bold text-zinc-900">FixIt</h1>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="hidden lg:flex"
                                onClick={toggleCollapse}
                            >
                                {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden"
                                onClick={onClose}
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    <nav className="flex-1 overflow-y-auto p-3">
                        <ul className="space-y-2">
                            {filteredNavItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.href;

                                return (
                                    <li key={item.href}>
                                        <Link
                                            to={item.href}
                                            onClick={() => {
                                                // Close sidebar only on mobile
                                                if (window.innerWidth < 1024) onClose();
                                            }}
                                            className={cn(
                                                "flex items-center rounded-lg transition-colors min-h-[44px]",
                                                isCollapsed ? "justify-center px-2 py-2" : "space-x-3 px-3 py-2",
                                                isActive
                                                    ? "bg-blue-900 text-white"
                                                    : "text-zinc-700 hover:bg-zinc-100"
                                            )}
                                            title={isCollapsed ? item.title : undefined}
                                        >
                                            <Icon className={cn("flex-shrink-0", isCollapsed ? "w-6 h-6" : "w-5 h-5")} />
                                            {!isCollapsed && <span className="font-medium whitespace-nowrap">{item.title}</span>}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {userRole === "admin" && !isCollapsed && (
                        <div className="p-4 border-t border-zinc-200">
                            <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-xs font-medium text-blue-900">Admin Mode</p>
                                <p className="text-xs text-zinc-600 mt-1">Full access enabled</p>
                            </div>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}
