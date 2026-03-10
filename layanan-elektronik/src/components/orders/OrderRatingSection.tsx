import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { OrderCardState } from "@/components/orders/types";

interface OrderRatingSectionProps {
  state: Pick<
    OrderCardState,
    "rating" | "ratingForm" | "submittingRating"
  >;
  fallbackDate: string;
  onStarsChange: (stars: number) => void;
  onReviewChange: (review: string) => void;
  onSubmitRating: () => void;
}

export function OrderRatingSection({
  state,
  fallbackDate,
  onStarsChange,
  onReviewChange,
  onSubmitRating,
}: OrderRatingSectionProps) {
  const { rating, ratingForm, submittingRating } = state;

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50/40 p-4 space-y-3">
      <p className="text-sm font-semibold text-blue-900">Penilaian Konsumen</p>

      {rating ? (
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={`rated-${index}`}
                className={`w-4 h-4 ${
                  index < rating.stars
                    ? "text-amber-400 fill-amber-400"
                    : "text-zinc-300"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-zinc-700">
            {rating.review || "Terima kasih atas penilaian Anda."}
          </p>
          <p className="text-[11px] text-zinc-500">
            Dinilai pada{" "}
            {format(new Date(rating.created_at || fallbackDate), "dd MMM yyyy, HH:mm", {
              locale: idLocale,
            })}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, index) => {
              const starValue = index + 1;
              const isActive = (ratingForm?.stars || 0) >= starValue;

              return (
                <button
                  key={`input-${starValue}`}
                  type="button"
                  onClick={() => onStarsChange(starValue)}
                  className="rounded-sm"
                  aria-label={`Pilih ${starValue} bintang`}
                >
                  <Star
                    className={`w-5 h-5 transition-colors ${
                      isActive ? "text-amber-400 fill-amber-400" : "text-zinc-300"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <Textarea
            className="min-h-[80px] bg-white"
            placeholder="Bagikan pengalaman layanan Anda (opsional)..."
            value={ratingForm?.review || ""}
            onChange={(event) => onReviewChange(event.target.value)}
          />

          <Button
            type="button"
            onClick={onSubmitRating}
            disabled={submittingRating}
            className="bg-blue-900 hover:bg-blue-950"
          >
            {submittingRating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Menyimpan Penilaian...
              </>
            ) : (
              "Kirim Penilaian"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
