import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { toast } from "sonner";

export default function RegisterPage() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        address: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (formData.password !== formData.confirmPassword) {
            const errorMsg = "Password dan konfirmasi password tidak cocok";
            setError(errorMsg);
            toast.error('Registrasi gagal', { description: errorMsg });
            setLoading(false);
            return;
        }

        try {
            const response = await api.register({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                address: formData.address || undefined,
            });

            if (response.token) {
                api.setToken(response.token);
                localStorage.setItem('user', JSON.stringify(response.user || response));

                toast.success('Registrasi berhasil!', {
                    description: `Selamat datang, ${response.user?.name || 'User'}!`
                });

                setTimeout(() => {
                    navigate('/dashboard');
                }, 500);
            } else {
                throw new Error('Token tidak ditemukan dalam response');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Registrasi gagal. Silakan coba lagi.';
            setError(errorMessage);
            toast.error('Registrasi gagal', { description: errorMessage });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <AuthHeader title="Daftar" subtitle="Buat akun baru Anda" />

                <Card className="border-zinc-200">
                    <CardHeader>
                        <CardTitle>Daftar</CardTitle>
                        <CardDescription>
                            Isi formulir di bawah untuk membuat akun baru
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Lengkap</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    className="border-zinc-300"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="nama@email.com"
                                    className="border-zinc-300"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Nomor Telepon</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="08123456789"
                                    className="border-zinc-300"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Alamat (Opsional)</Label>
                                <Input
                                    id="address"
                                    type="text"
                                    placeholder="Jakarta Selatan"
                                    className="border-zinc-300"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <PasswordInput
                                    id="password"
                                    value={formData.password}
                                    onChange={(value) => setFormData({ ...formData, password: value })}
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Konfirmasi Password</Label>
                                <PasswordInput
                                    id="confirm-password"
                                    value={formData.confirmPassword}
                                    onChange={(value) => setFormData({ ...formData, confirmPassword: value })}
                                    required
                                    minLength={6}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-blue-900 hover:bg-blue-950"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Memproses...
                                    </>
                                ) : (
                                    'Daftar'
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm text-zinc-600">
                            Sudah punya akun?{" "}
                            <Link to="/login" className="text-blue-900 hover:text-blue-950 font-medium">
                                Masuk di sini
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
