export type WarrantyClaimStatus =
  | "submitted"
  | "in_review"
  | "approved"
  | "rejected"
  | "resolved";

export interface OrderWarranty {
  order_id: number;
  user_id: number;
  duration_days: number;
  description: string;
  starts_at: string;
  expires_at: string;
  updated_at: string;
}

export interface WarrantyClaim {
  claim_id: string;
  order_id: number;
  user_id: number;
  description: string;
  photo?: string;
  status: WarrantyClaimStatus;
  admin_note?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderRating {
  rating_id: string;
  order_id: number;
  user_id: number;
  user_name: string;
  stars: number;
  review?: string;
  service_name?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface WarrantyInput {
  order_id: number;
  user_id: number;
  duration_days: number;
  description: string;
}

export interface WarrantyClaimInput {
  order_id: number;
  user_id: number;
  description: string;
  photo?: string;
}

export interface RatingInput {
  order_id: number;
  user_id: number;
  user_name: string;
  stars: number;
  review?: string;
  service_name?: string;
}
