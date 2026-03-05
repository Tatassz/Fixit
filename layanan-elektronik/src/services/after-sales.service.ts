import type {
  Order,
  OrderRating,
  RatingInput,
  OrderWarranty,
  WarrantyInput,
  WarrantyClaim,
  WarrantyClaimInput,
  WarrantyClaimStatus,
} from "@/types";
import { AFTER_SALES_FALLBACK } from "@/data/after-sales-fallback";

const STORAGE_KEYS = {
  warranties: "fixit_warranty_v1",
  claims: "fixit_claims_v1",
  ratings: "fixit_ratings_v1",
} as const;

const nowIso = () => new Date().toISOString();

const createId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

class AfterSalesService {
  private readonly fallbackConfig = AFTER_SALES_FALLBACK;

  private isBrowser(): boolean {
    return typeof window !== "undefined";
  }

  private readList<T>(key: string): T[] {
    if (!this.isBrowser()) return [];

    const rawData = window.localStorage.getItem(key);
    if (!rawData) return [];

    try {
      const parsedData: unknown = JSON.parse(rawData);
      return Array.isArray(parsedData) ? (parsedData as T[]) : [];
    } catch {
      return [];
    }
  }

  private writeList<T>(key: string, value: T[]): void {
    if (!this.isBrowser()) return;
    window.localStorage.setItem(key, JSON.stringify(value));
  }

  private sortByLatest<T extends { created_at: string }>(items: T[]): T[] {
    return [...items].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }

  private normalizeRating(item: OrderRating): OrderRating {
    return {
      ...item,
      is_published: item.is_published !== false,
    };
  }

  getWarranties(): OrderWarranty[] {
    return this.readList<OrderWarranty>(STORAGE_KEYS.warranties);
  }

  getWarrantyByOrder(orderId: number): OrderWarranty | null {
    return (
      this.getWarranties().find((item) => item.order_id === orderId) || null
    );
  }

  isWarrantyRecordActive(warranty: OrderWarranty | null): boolean {
    if (!warranty) return false;
    return new Date(warranty.expires_at).getTime() >= Date.now();
  }

  isWarrantyActive(orderId: number): boolean {
    return this.isWarrantyRecordActive(this.getWarrantyByOrder(orderId));
  }

  buildFallbackWarranty(
    order: Pick<Order, "order_id" | "user_id" | "created_at" | "updated_at">,
  ): OrderWarranty {
    const startsAt = order.updated_at || order.created_at || nowIso();
    const expiryDate = new Date(startsAt);
    expiryDate.setDate(
      expiryDate.getDate() + this.fallbackConfig.warrantyDurationDays,
    );

    return {
      order_id: order.order_id,
      user_id: order.user_id,
      duration_days: this.fallbackConfig.warrantyDurationDays,
      description: this.fallbackConfig.warrantyDescription,
      starts_at: startsAt,
      expires_at: expiryDate.toISOString(),
      updated_at: startsAt,
    };
  }

  getEffectiveWarranty(
    order: Pick<Order, "order_id" | "user_id" | "created_at" | "updated_at">,
    allowFallback = false,
  ): OrderWarranty | null {
    const existingWarranty = this.getWarrantyByOrder(order.order_id);
    if (existingWarranty) return existingWarranty;
    if (!allowFallback) return null;

    return this.buildFallbackWarranty(order);
  }

  ensureWarrantyForOrder(
    order: Pick<Order, "order_id" | "user_id" | "created_at" | "updated_at">,
  ): OrderWarranty {
    const existingWarranty = this.getWarrantyByOrder(order.order_id);
    if (existingWarranty) return existingWarranty;

    const fallbackWarranty = this.buildFallbackWarranty(order);
    const allWarranties = this.getWarranties();
    this.writeList(STORAGE_KEYS.warranties, [...allWarranties, fallbackWarranty]);

    return fallbackWarranty;
  }

  upsertWarranty(input: WarrantyInput): OrderWarranty {
    const existingItems = this.getWarranties();
    const existingItem = existingItems.find(
      (item) => item.order_id === input.order_id,
    );

    const durationDays = Math.max(1, Math.floor(input.duration_days || 1));
    const startsAt = existingItem?.starts_at || nowIso();
    const expiryDate = new Date(startsAt);
    expiryDate.setDate(expiryDate.getDate() + durationDays);

    const nextWarranty: OrderWarranty = {
      order_id: input.order_id,
      user_id: input.user_id,
      duration_days: durationDays,
      description: input.description.trim(),
      starts_at: startsAt,
      expires_at: expiryDate.toISOString(),
      updated_at: nowIso(),
    };

    const nextItems = existingItems.some(
      (item) => item.order_id === input.order_id,
    )
      ? existingItems.map((item) =>
          item.order_id === input.order_id ? nextWarranty : item,
        )
      : [...existingItems, nextWarranty];

    this.writeList(STORAGE_KEYS.warranties, nextItems);
    return nextWarranty;
  }

  getAllClaims(): WarrantyClaim[] {
    return this.sortByLatest(this.readList<WarrantyClaim>(STORAGE_KEYS.claims));
  }

  getClaimsByOrder(orderId: number): WarrantyClaim[] {
    return this.getAllClaims().filter((claim) => claim.order_id === orderId);
  }

  submitClaim(input: WarrantyClaimInput): WarrantyClaim {
    const allClaims = this.getAllClaims();

    const nextClaim: WarrantyClaim = {
      claim_id: createId("CLM"),
      order_id: input.order_id,
      user_id: input.user_id,
      description: input.description.trim(),
      photo: input.photo,
      status: "submitted",
      created_at: nowIso(),
      updated_at: nowIso(),
    };

    this.writeList(STORAGE_KEYS.claims, [nextClaim, ...allClaims]);
    return nextClaim;
  }

  updateClaimStatus(
    claimId: string,
    status: WarrantyClaimStatus,
    adminNote?: string,
  ): WarrantyClaim {
    const allClaims = this.getAllClaims();
    const targetClaim = allClaims.find((claim) => claim.claim_id === claimId);

    if (!targetClaim) {
      throw new Error("Data klaim garansi tidak ditemukan");
    }

    const updatedClaim: WarrantyClaim = {
      ...targetClaim,
      status,
      admin_note: adminNote?.trim() || targetClaim.admin_note,
      updated_at: nowIso(),
    };

    const updatedClaims = allClaims.map((claim) =>
      claim.claim_id === claimId ? updatedClaim : claim,
    );

    this.writeList(STORAGE_KEYS.claims, updatedClaims);
    return updatedClaim;
  }

  getRatings(): OrderRating[] {
    const rawRatings = this.readList<OrderRating>(STORAGE_KEYS.ratings);
    return this.sortByLatest(rawRatings.map((item) => this.normalizeRating(item)));
  }

  getRatingByOrder(orderId: number): OrderRating | null {
    return this.getRatings().find((item) => item.order_id === orderId) || null;
  }

  upsertRating(input: RatingInput): OrderRating {
    const existingRatings = this.getRatings();
    const existingRating = existingRatings.find(
      (item) => item.order_id === input.order_id,
    );

    const stars = Math.min(5, Math.max(1, Math.round(input.stars)));

    const nextRating: OrderRating = {
      rating_id: existingRating?.rating_id || createId("RTG"),
      order_id: input.order_id,
      user_id: input.user_id,
      user_name: input.user_name,
      stars,
      review: input.review?.trim(),
      service_name: input.service_name,
      is_published: existingRating?.is_published ?? true,
      created_at: existingRating?.created_at || nowIso(),
      updated_at: nowIso(),
    };

    const nextItems = existingRatings.some(
      (item) => item.order_id === input.order_id,
    )
      ? existingRatings.map((item) =>
          item.order_id === input.order_id ? nextRating : item,
        )
      : [nextRating, ...existingRatings];

    this.writeList(STORAGE_KEYS.ratings, nextItems);
    return nextRating;
  }

  getAverageRating(): number {
    const allRatings = this.getPublishedRatings();
    if (allRatings.length === 0) return 0;

    const total = allRatings.reduce((sum, item) => sum + item.stars, 0);
    return total / allRatings.length;
  }

  getPublishedRatings(): OrderRating[] {
    return this.getRatings().filter((item) => item.is_published !== false);
  }

  getLatestRatings(limit = 6, onlyPublished = true): OrderRating[] {
    const source = onlyPublished ? this.getPublishedRatings() : this.getRatings();
    return source.slice(0, limit);
  }

  setRatingVisibility(ratingId: string, isPublished: boolean): OrderRating {
    const allRatings = this.getRatings();
    const targetRating = allRatings.find((item) => item.rating_id === ratingId);

    if (!targetRating) {
      throw new Error("Data rating tidak ditemukan");
    }

    const updatedRating: OrderRating = {
      ...targetRating,
      is_published: isPublished,
      updated_at: nowIso(),
    };

    const nextRatings = allRatings.map((item) =>
      item.rating_id === ratingId ? updatedRating : item,
    );
    this.writeList(STORAGE_KEYS.ratings, nextRatings);

    return updatedRating;
  }

  deleteRating(ratingId: string): void {
    const allRatings = this.getRatings();
    const nextRatings = allRatings.filter((item) => item.rating_id !== ratingId);
    this.writeList(STORAGE_KEYS.ratings, nextRatings);
  }
}

export const afterSalesService = new AfterSalesService();
