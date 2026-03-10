import { CheckCircle2, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import {
  PAYMENT_METHOD_OPTIONS,
  type PaymentMethodValue,
} from "@/data/payment-methods";
import type { OrderWithPayment } from "@/components/orders/types";

interface PaymentDialogProps {
  open: boolean;
  selectedOrder: OrderWithPayment | null;
  paymentMethod: PaymentMethodValue;
  creatingPayment: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentMethodChange: (method: PaymentMethodValue) => void;
  onConfirm: () => void;
}

export function PaymentDialog({
  open,
  selectedOrder,
  paymentMethod,
  creatingPayment,
  onOpenChange,
  onPaymentMethodChange,
  onConfirm,
}: PaymentDialogProps) {
  const selectedMethod = PAYMENT_METHOD_OPTIONS.find(
    (option) => option.value === paymentMethod,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-900" />
            Pembayaran Order #{selectedOrder?.order_id}
          </DialogTitle>
          <DialogDescription>
            Pilih metode pembayaran untuk menyelesaikan transaksi
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 font-medium">Total Pembayaran</p>
            <p className="text-3xl font-bold text-blue-900 mt-1">
              {formatCurrency(
                selectedOrder?.final_cost || selectedOrder?.cost_estimation || 0,
              )}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-method">Metode Pembayaran</Label>
            <Select
              value={paymentMethod}
              onValueChange={(value) => onPaymentMethodChange(value as PaymentMethodValue)}
            >
              <SelectTrigger id="payment-method">
                <SelectValue placeholder="Pilih metode pembayaran" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHOD_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <span>{option.icon}</span>
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedMethod && (
            <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 text-sm">
              <p className="font-medium text-zinc-900 mb-2">Instruksi:</p>
              <ul className="space-y-1 text-zinc-600">
                {selectedMethod.instructions.map((instruction) => (
                  <li key={instruction}>- {instruction}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={creatingPayment}
          >
            Batal
          </Button>
          <Button
            onClick={onConfirm}
            disabled={creatingPayment}
            className="bg-green-600 hover:bg-green-700"
          >
            {creatingPayment ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Konfirmasi Pembayaran
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
