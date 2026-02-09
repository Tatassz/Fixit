import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { User as UserType } from "@/types";

interface ProfileCardProps {
    user: UserType;
    onEditClick: () => void;
}

export function ProfileCard({ user, onEditClick }: ProfileCardProps) {
    return (
        <Card className="mb-8 border-zinc-200">
            <CardHeader>
                <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Informasi Profil
                </CardTitle>
                <CardDescription>Detail akun Anda</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-zinc-600">Nama</p>
                        <p className="font-medium text-zinc-900">{user.name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-zinc-600">Email</p>
                        <p className="font-medium text-zinc-900">{user.email}</p>
                    </div>
                    <div>
                        <p className="text-sm text-zinc-600">Telepon</p>
                        <p className="font-medium text-zinc-900">{user.phone}</p>
                    </div>
                    <div>
                        <p className="text-sm text-zinc-600">Alamat</p>
                        <p className="font-medium text-zinc-900">{user.address || 'Belum diisi'}</p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    className="mt-4 border-zinc-300"
                    onClick={onEditClick}
                >
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profil
                </Button>
            </CardContent>
        </Card>
    );
}
