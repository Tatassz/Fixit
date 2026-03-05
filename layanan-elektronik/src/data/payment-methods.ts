export type PaymentMethodValue = "transfer" | "cash" | "ewallet";

export interface PaymentMethodOption {
  value: PaymentMethodValue;
  label: string;
  icon: string;
  instructions: string[];
}

export const PAYMENT_METHOD_OPTIONS: PaymentMethodOption[] = [
  {
    value: "transfer",
    label: "Transfer Bank",
    icon: "🏦",
    instructions: [
      "Bank BCA: 1234567890 a/n Fix Service",
      "Bank Mandiri: 0987654321 a/n Fix Service",
      "Konfirmasi akan dikirim setelah pembayaran terverifikasi",
    ],
  },
  {
    value: "cash",
    label: "Tunai",
    icon: "💵",
    instructions: [
      "Pembayaran dapat dilakukan langsung kepada teknisi saat pengantaran perangkat.",
    ],
  },
  {
    value: "ewallet",
    label: "E-Wallet (GoPay, OVO, Dana)",
    icon: "📱",
    instructions: [
      "GoPay: 08123456789",
      "OVO: 08123456789",
      "DANA: 08123456789",
    ],
  },
];
