import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { userService } from "@/services";
import { toast } from "sonner";
import { Loader2, User as UserIcon, Mail, Phone, MapPin } from "lucide-react";
import type { User } from "@/types";

interface ProfileFormProps {
    initialUser: User;
    onUpdate: (user: User) => void;
}

export function ProfileForm({ initialUser, onUpdate }: ProfileFormProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: initialUser.name,
        email: initialUser.email,
        phone: initialUser.phone,
        address: initialUser.address || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const updatedUser = await userService.updateProfile({
                name: formData.name,
                phone: formData.phone,
                address: formData.address,
            });

            onUpdate(updatedUser);
            toast.success("Profil berhasil diperbarui");
        } catch (err) {
            toast.error("Gagal memperbarui profil", {
                description: err instanceof Error ? err.message : "Terjadi kesalahan",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserIcon className="w-8 h-8 text-blue-900" />
                    </div>
                    <div>
                        <CardTitle>Informasi Akun</CardTitle>
                        <CardDescription>Update detail profil Anda di sini</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="pl-9"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                                <Input
                                    id="email"
                                    value={formData.email}
                                    className="pl-9 bg-zinc-50"
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Nomor Telepon</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="pl-9"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Alamat Lengkap</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                            <Textarea
                                id="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="pl-9 min-h-[100px]"
                                placeholder="Masukkan alamat lengkap.."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            className="bg-blue-900 hover:bg-blue-950 min-w-[120px]"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                'Simpan Perubahan'
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
