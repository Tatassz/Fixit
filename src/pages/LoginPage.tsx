import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { authService } from "@/services";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { toast } from "sonner";
import type { User } from "@/types";

export default function LoginPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Logic: Try User login first. If it fails, try Admin login.
            let user: User | null = null;
            let token: string | null = null;
            let isRoleAdmin = false;

            try {
                const response = await authService.login(formData.email, formData.password);
                user = response.user;
                token = response.token;
            } catch (userError) {
                // User login failed, try Admin login
                try {
                    const adminResponse = await authService.adminLogin(formData.email, formData.password);
                    user = adminResponse.user;
                    token = adminResponse.token;
                    isRoleAdmin = true;
                } catch (adminError) {
                    // Both failed, throw original error or a generic one
                    throw new Error('Login gagal. Periksa email dan password Anda.');
                }
            }

            if (token && user) {
                authService.setToken(token);
                localStorage.setItem('user', JSON.stringify(user));

                toast.success(isRoleAdmin ? 'Login admin berhasil!' : 'Login berhasil!', {
                    description: `Selamat datang, ${user.name}!`
                });

                setTimeout(() => {
                    if (user?.role === 'admin' || isRoleAdmin) {
                        navigate('/admin/dashboard');
                    } else {
                        navigate('/dashboard');
                    }
                }, 500);
            } else {
                throw new Error('Token tidak ditemukan dalam response');
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Login gagal. Periksa email dan password Anda.';
            setError(errorMessage);
            toast.error('Login gagal', {
                description: errorMessage
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <AuthHeader title="Masuk" subtitle="Masuk ke akun Anda" />

                <Card className="border-zinc-200">
                    <CardHeader>
                        <CardTitle>Masuk</CardTitle>
                        <CardDescription>
                            Masukkan email dan password Anda untuk melanjutkan
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
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link to="/forgot-password" className="text-sm text-blue-900 hover:text-blue-950">
                                        Lupa password?
                                    </Link>
                                </div>
                                <PasswordInput
                                    id="password"
                                    value={formData.password}
                                    onChange={(value) => setFormData({ ...formData, password: value })}
                                    required
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
                                    'Masuk'
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm text-zinc-600">
                            Belum punya akun?{" "}
                            <Link to="/register" className="text-blue-900 hover:text-blue-950 font-medium">
                                Daftar sekarang
                            </Link>
                        </div>

                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-zinc-700">
                            <p className="font-medium mb-1">Demo Account:</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-zinc-500">User:</p>
                                    <p className="text-xs">andi@mail.com</p>
                                    <p className="text-xs">password123</p>
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500">Admin:</p>
                                    <p className="text-xs">admin@fixservice.com</p>
                                    <p className="text-xs">admin123</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
