import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
    status: string;
    className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
    // Service Status
    active: { label: "Tersedia", className: "bg-blue-900 border-transparent text-primary-foreground hover:bg-blue-900/80" },
    inactive: { label: "Tidak Tersedia", className: "bg-zinc-500 border-transparent text-primary-foreground hover:bg-zinc-500/80" },

    // Payment Status
    paid: { label: "Lunas", className: "bg-green-600 border-transparent text-primary-foreground hover:bg-green-600/80" },
    pending: { label: "Menunggu", className: "bg-yellow-600 border-transparent text-primary-foreground hover:bg-yellow-600/80" },
    failed: { label: "Gagal", className: "bg-red-600 border-transparent text-primary-foreground hover:bg-red-600/80" },

    // Order Status
    waiting: { label: "Menunggu", className: "bg-yellow-600 border-transparent text-primary-foreground hover:bg-yellow-600/80" },
    on_progress: { label: "Diproses", className: "bg-blue-600 border-transparent text-primary-foreground hover:bg-blue-600/80" },
    completed: { label: "Selesai", className: "bg-green-600 border-transparent text-primary-foreground hover:bg-green-600/80" },
    cancelled: { label: "Dibatalkan", className: "bg-red-600 border-transparent text-primary-foreground hover:bg-red-600/80" },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const config = statusConfig[status] || { label: status, className: "bg-zinc-500 border-transparent text-primary-foreground" };

    return (
        <Badge className={config.className + " " + (className || "")}>
            {config.label}
        </Badge>
    );
}
