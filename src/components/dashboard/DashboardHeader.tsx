import { Button } from "@/components/ui/button";
import { Wrench, LogOut } from "lucide-react";

interface DashboardHeaderProps {
    onLogout: () => void;
}

export function DashboardHeader({ onLogout }: DashboardHeaderProps) {
    return (
        <header className="bg-white border-b border-zinc-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
                            <Wrench className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-zinc-900">FixIt</h1>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={onLogout}
                        className="text-zinc-600 hover:text-zinc-900"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Keluar
                    </Button>
                </div>
            </div>
        </header>
    );
}
