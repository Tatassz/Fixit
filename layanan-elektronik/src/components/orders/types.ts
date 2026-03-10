import type {
  Order,
  OrderRating,
  OrderWarranty,
  Payment,
  WarrantyClaim,
} from "@/types";

export interface OrderWithPayment extends Order {
  payment?: Payment | null;
}

export interface ClaimFormState {
  description: string;
  photo?: string;
}

export interface RatingFormState {
  stars: number;
  review: string;
}

export interface OrderCardState {
  warranty: OrderWarranty | null;
  isWarrantyActive: boolean;
  claims: WarrantyClaim[];
  claimForm?: ClaimFormState;
  rating: OrderRating | null;
  ratingForm?: RatingFormState;
  submittingClaim: boolean;
  submittingRating: boolean;
}
