import { useEffect, useState } from "react";
import { adminService } from "@/services";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Mail, Phone, MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { User } from "@/types";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await adminService.getAllUsers();
            setUsers(data || []);
        } catch (error) {
            console.error('Failed to load users:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-900" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-zinc-900">Kelola User</h2>
                    <p className="text-zinc-600">Daftar pengguna terdaftar di sistem</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
                    <Input
                        type="search"
                        placeholder="Cari nama, email..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Card className="border-zinc-200">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">ID</TableHead>
                                <TableHead>Nama Pengguna</TableHead>
                                <TableHead>Kontak</TableHead>
                                <TableHead>Alamat</TableHead>
                                <TableHead>Bergabung</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-zinc-500">
                                        Tidak ada user ditemukan
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((user) => (
                                    <TableRow key={user.id} className="hover:bg-zinc-50">
                                        <TableCell className="font-mono text-zinc-500">{user.id}</TableCell>
                                        <TableCell>
                                            <div className="font-medium text-zinc-900">{user.name}</div>
                                            <div className="text-sm text-zinc-500">{user.role || 'User'}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-zinc-600">
                                                    <Mail className="w-3 h-3" /> {user.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-zinc-600">
                                                    <Phone className="w-3 h-3" /> {user.phone}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-start gap-2 text-sm text-zinc-600 max-w-[200px]">
                                                <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                                <span className="line-clamp-2">{user.address}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-zinc-500 whitespace-nowrap">
                                            {format(new Date(user.created_at), 'dd MMM yyyy', { locale: idLocale })}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
