import type { OrderRating } from "@/types";

const nowIso = new Date().toISOString();

export const FALLBACK_TESTIMONIALS: OrderRating[] = [
  {
    rating_id: "fallback-1",
    order_id: 0,
    user_id: 0,
    user_name: "Rina",
    stars: 5,
    review: "Proses cepat, teknisi ramah, dan hasil service rapi.",
    service_name: "Perbaikan TV",
    is_published: true,
    created_at: nowIso,
    updated_at: nowIso,
  },
  {
    rating_id: "fallback-2",
    order_id: 0,
    user_id: 0,
    user_name: "Arif",
    stars: 5,
    review: "Enak bisa tracking order dan invoice langsung dari aplikasi.",
    service_name: "Perbaikan AC",
    is_published: true,
    created_at: nowIso,
    updated_at: nowIso,
  },
  {
    rating_id: "fallback-3",
    order_id: 0,
    user_id: 0,
    user_name: "Maya",
    stars: 4,
    review: "Garansi jelas dan customer care responsif saat saya tanya.",
    service_name: "Perbaikan Kulkas",
    is_published: true,
    created_at: nowIso,
    updated_at: nowIso,
  },
];
