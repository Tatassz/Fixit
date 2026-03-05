import { useEffect, useState } from "react";
import { afterSalesService } from "@/services";
import { Star } from "lucide-react";
import type { OrderRating } from "@/types";
import { FALLBACK_TESTIMONIALS } from "@/data/testimonials-fallback";

export function TestimonialsSection() {
  const [ratings, setRatings] = useState<OrderRating[]>([]);

  useEffect(() => {
    const latestRatings = afterSalesService.getLatestRatings(6);
    setRatings(latestRatings.length > 0 ? latestRatings : FALLBACK_TESTIMONIALS);
  }, []);

  return (
    <section id="testimoni" className="py-24 bg-[#fbfbfd]">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20 relative">
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight mb-6">
            Kualitas yang Berbicara.
          </h2>
          <p className="text-xl text-zinc-500 font-medium tracking-tight">
            Ribuan perangkat telah berfungsi kembali. Dengarkan secara langsung
            pengalaman pelanggan kami.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
          {ratings.slice(0, 3).map((rating) => (
            <div key={rating.rating_id} className="bg-white rounded-[2rem] p-8 shadow-sm border border-black/5 hover:shadow-lg transition-shadow duration-500">
              <div className="flex items-center gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={`${rating.rating_id}-${index}`}
                    className={`w-4 h-4 ${index < rating.stars
                        ? "text-black fill-black"
                        : "text-zinc-200"
                      }`}
                  />
                ))}
              </div>

              <blockquote className="text-lg text-zinc-800 font-medium leading-relaxed tracking-tight mb-8 min-h-[80px]">
                "{rating.review || "Pelayanan luar biasa cepat dan memuaskan."}"
              </blockquote>

              <div className="border-t border-zinc-100 pt-6">
                <p className="font-semibold text-zinc-900 tracking-tight">
                  {rating.user_name}
                </p>
                <p className="text-sm text-zinc-500 mt-1">
                  {rating.service_name || "Perbaikan Standar"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
