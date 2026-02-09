export interface Payment {
  payment_id: string;
  order_id: number;
  payment_method: string;
  amount: number;
  status: "pending" | "paid" | "failed";
  created_at: string;
  paid_at?: string;
}
