import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { ShieldAlert, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/status-badge";
import { Textarea } from "@/components/ui/textarea";
import type {
  OrderCardState,
  OrderWithPayment,
} from "@/components/orders/types";

interface OrderWarrantySectionProps {
  order: OrderWithPayment;
  state: Pick<
    OrderCardState,
    "warranty" | "isWarrantyActive" | "claims" | "claimForm" | "submittingClaim"
  >;
  onClaimDescriptionChange: (description: string) => void;
  onClaimPhotoChange: (file?: File) => void;
  onSubmitClaim: () => void;
}

export function OrderWarrantySection({
  order,
  state,
  onClaimDescriptionChange,
  onClaimPhotoChange,
  onSubmitClaim,
}: OrderWarrantySectionProps) {
  const { warranty, isWarrantyActive, claims, claimForm, submittingClaim } = state;

  if (!warranty) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div
        className={`rounded-lg p-4 border ${
          isWarrantyActive
            ? "border-emerald-200 bg-emerald-50"
            : "border-zinc-300 bg-zinc-100"
        }`}
      >
        <div className="flex items-start gap-2">
          <ShieldAlert
            className={`w-4 h-4 mt-0.5 ${
              isWarrantyActive ? "text-emerald-700" : "text-zinc-600"
            }`}
          />
          <div className="space-y-1">
            <p
              className={`text-sm font-semibold ${
                isWarrantyActive ? "text-emerald-900" : "text-zinc-700"
              }`}
            >
              {isWarrantyActive ? "Garansi Masih Aktif" : "Garansi Sudah Berakhir"}
            </p>
            <p
              className={`text-xs ${
                isWarrantyActive ? "text-emerald-800" : "text-zinc-600"
              }`}
            >
              Berlaku hingga{" "}
              {format(new Date(warranty.expires_at || order.updated_at), "dd MMMM yyyy", {
                locale: idLocale,
              })}
            </p>
            <p
              className={`text-xs ${
                isWarrantyActive ? "text-emerald-700" : "text-zinc-600"
              }`}
            >
              {warranty.description}
            </p>
          </div>
        </div>
      </div>

      {isWarrantyActive && (
        <div className="rounded-lg border border-zinc-200 p-4 space-y-4">
          <h4 className="font-semibold text-sm text-zinc-900">
            Form Klaim Garansi / Customer Care
          </h4>

          <div className="space-y-2">
            <Label htmlFor={`claim-desc-${order.order_id}`}>Keluhan</Label>
            <Textarea
              id={`claim-desc-${order.order_id}`}
              className="min-h-[90px]"
              placeholder="Jelaskan kendala yang masih terjadi setelah perbaikan..."
              value={claimForm?.description || ""}
              onChange={(event) => onClaimDescriptionChange(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`claim-photo-${order.order_id}`}>
              Upload Foto (opsional, maks 2MB)
            </Label>
            <Input
              id={`claim-photo-${order.order_id}`}
              type="file"
              accept="image/*"
              onChange={(event) => onClaimPhotoChange(event.target.files?.[0])}
            />

            {claimForm?.photo && (
              <img
                src={claimForm.photo}
                alt="Preview klaim garansi"
                className="h-24 rounded-md border border-zinc-200 object-cover"
              />
            )}
          </div>

          <Button type="button" onClick={onSubmitClaim} disabled={submittingClaim}>
            {submittingClaim ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Mengirim Klaim...
              </>
            ) : (
              "Kirim Klaim Garansi"
            )}
          </Button>
        </div>
      )}

      {claims.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-zinc-200">
          <p className="text-xs font-medium text-zinc-700">Riwayat Klaim Garansi</p>
          {claims.map((claim) => (
            <div
              key={claim.claim_id}
              className="rounded-md border border-zinc-200 p-3 bg-zinc-50"
            >
              <div className="flex justify-between items-center mb-1">
                <StatusBadge status={claim.status} />
                <span className="text-[11px] text-zinc-500">
                  {format(new Date(claim.created_at), "dd MMM yyyy, HH:mm", {
                    locale: idLocale,
                  })}
                </span>
              </div>
              <p className="text-xs text-zinc-700">{claim.description}</p>
              {claim.admin_note && (
                <p className="text-xs text-blue-800 mt-1">
                  Catatan admin: {claim.admin_note}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
