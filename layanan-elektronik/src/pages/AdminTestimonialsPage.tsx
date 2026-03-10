import { useMemo, useState } from "react";
import { afterSalesService } from "@/services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  EyeOff,
  Search,
  Star,
  Trash2,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import type { OrderRating } from "@/types";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

type VisibilityFilter = "all" | "published" | "hidden";

const getInitialRatings = () => afterSalesService.getRatings();

export default function AdminTestimonialsPage() {
  const [ratings, setRatings] = useState<OrderRating[]>(getInitialRatings);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>("all");

  const reloadRatings = () => {
    setRatings(afterSalesService.getRatings());
  };

  const filteredRatings = useMemo(() => {
    const keyword = searchTerm.toLowerCase();

    return ratings.filter((rating) => {
      const byVisibility =
        visibilityFilter === "all"
          ? true
          : visibilityFilter === "published"
            ? rating.is_published
            : !rating.is_published;

      const byKeyword =
        rating.user_name.toLowerCase().includes(keyword) ||
        (rating.service_name || "").toLowerCase().includes(keyword) ||
        (rating.review || "").toLowerCase().includes(keyword) ||
        rating.order_id.toString().includes(keyword);

      return byVisibility && byKeyword;
    });
  }, [ratings, searchTerm, visibilityFilter]);

  const publishedRatings = useMemo(
    () => ratings.filter((item) => item.is_published),
    [ratings],
  );

  const avgRating = useMemo(() => {
    if (publishedRatings.length === 0) return 0;
    const total = publishedRatings.reduce((sum, item) => sum + item.stars, 0);
    return total / publishedRatings.length;
  }, [publishedRatings]);

  const handleToggleVisibility = (rating: OrderRating) => {
    try {
      afterSalesService.setRatingVisibility(rating.rating_id, !rating.is_published);
      reloadRatings();
      toast.success(
        rating.is_published
          ? "Testimoni disembunyikan dari landing page"
          : "Testimoni ditampilkan di landing page",
      );
    } catch (error) {
      console.error("Failed to toggle rating visibility:", error);
      toast.error("Gagal update visibilitas testimoni");
    }
  };

  const handleDeleteRating = (rating: OrderRating) => {
    const confirmed = window.confirm(
      `Hapus testimoni dari ${rating.user_name} untuk Order #${rating.order_id}?`,
    );

    if (!confirmed) return;

    try {
      afterSalesService.deleteRating(rating.rating_id);
      reloadRatings();
      toast.success("Testimoni berhasil dihapus");
    } catch (error) {
      console.error("Failed to delete rating:", error);
      toast.error("Gagal menghapus testimoni");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900">Manajemen Testimoni</h2>
          <p className="text-zinc-600">
            Kelola rating pelanggan yang tampil di landing page
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
          <Input
            type="search"
            className="pl-9"
            placeholder="Cari user, service, ulasan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-zinc-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-600">Total Testimoni</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-zinc-900">{ratings.length}</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-600">Ditampilkan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-700">{publishedRatings.length}</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-600">Rata-rata Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-900">
              {avgRating > 0 ? avgRating.toFixed(1) : "0.0"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        {([
          { value: "all", label: "Semua" },
          { value: "published", label: "Ditampilkan" },
          { value: "hidden", label: "Disembunyikan" },
        ] as const).map((item) => (
          <Button
            key={item.value}
            type="button"
            size="sm"
            variant={visibilityFilter === item.value ? "default" : "outline"}
            className={
              visibilityFilter === item.value
                ? "bg-blue-900 hover:bg-blue-950"
                : "bg-white"
            }
            onClick={() => setVisibilityFilter(item.value)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      <Card className="border-zinc-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Pelanggan</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Ulasan</TableHead>
                <TableHead>Status Tampil</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRatings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-zinc-500">
                    Tidak ada testimoni untuk filter ini.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRatings.map((rating) => (
                  <TableRow key={rating.rating_id}>
                    <TableCell className="font-medium">#{rating.order_id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-zinc-900">{rating.user_name}</span>
                        <span className="text-xs text-zinc-500">
                          {rating.service_name || "Layanan Elektronik"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={`${rating.rating_id}-${index}`}
                            className={`w-3.5 h-3.5 ${
                              index < rating.stars
                                ? "text-amber-400 fill-amber-400"
                                : "text-zinc-300"
                            }`}
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[320px] text-sm text-zinc-700 line-clamp-2">
                        {rating.review || (
                          <span className="inline-flex items-center gap-1 text-zinc-500">
                            <MessageSquare className="w-3.5 h-3.5" />
                            Tanpa komentar
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {rating.is_published ? (
                        <Badge className="bg-emerald-600 hover:bg-emerald-700">
                          Tampil
                        </Badge>
                      ) : (
                        <Badge className="bg-zinc-500 hover:bg-zinc-600">
                          Tersembunyi
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-zinc-500">
                      {format(new Date(rating.created_at), "dd MMM yyyy, HH:mm", {
                        locale: idLocale,
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleVisibility(rating)}
                        >
                          {rating.is_published ? (
                            <>
                              <EyeOff className="w-4 h-4 mr-2" />
                              Hide
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4 mr-2" />
                              Show
                            </>
                          )}
                        </Button>

                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="border-red-200 text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteRating(rating)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Hapus
                        </Button>
                      </div>
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
