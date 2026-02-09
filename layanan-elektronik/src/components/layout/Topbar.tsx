import { Button } from "@/components/ui/button";
import { Menu, LogOut, User as UserIcon, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

interface TopbarProps {
    onMenuClick: () => void;
    onLogout: () => void;
    userName?: string;
}

export function Topbar({ onMenuClick, onLogout, userName }: TopbarProps) {
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

    // Get initials for avatar
    const initials = userName
        ? userName
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()
        : "U";

    return (
        <>
            <header className="bg-white border-b border-zinc-200 sticky top-0 z-30">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={onMenuClick}
                        >
                            <Menu className="w-5 h-5" />
                        </Button>
                    </div>

                    <div className="flex items-center space-x-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-full hover:bg-zinc-100 flex items-center gap-2 pl-2 pr-4 rounded-full border border-zinc-200">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="" alt={userName} />
                                        <AvatarFallback className="bg-blue-100 text-blue-900 font-bold">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col items-start text-sm">
                                        <span className="font-semibold text-zinc-900">
                                            {userName || "User"}
                                        </span>
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{userName}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            Pengguna
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link to="/profile" className="cursor-pointer flex items-center py-3">
                                        <UserIcon className="mr-2 h-4 w-4" />
                                        <span className="text-base font-medium">Profil Saya</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to="/settings" className="cursor-pointer flex items-center">
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Pengaturan</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-red-600 focus:text-red-600 cursor-pointer"
                                    onSelect={() => setShowLogoutDialog(true)}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Keluar</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Keluar</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin keluar dari akun Anda?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={onLogout} className="bg-red-600 hover:bg-red-700">
                            Keluar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
