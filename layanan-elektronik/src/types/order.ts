export interface Order {
  order_id: number;
  user_id: number;
  service_id: number;
  service_name?: string;
  device_brand: string;
  device_type: string;
  problem_description: string;
  device_photo?: string; // URL or Base64
  address: string;
  status: "waiting" | "on_progress" | "completed" | "cancelled" | "returned";
  technician_id?: number;
  technician_name?: string;
  technician_phone?: string;
  cost_estimation?: number;
  final_cost?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderData {
  service_id: number;
  device_brand: string;
  device_type: string;
  problem_description: string;
  device_photo?: string;
  address: string;
}

export interface UpdateOrderStatusData {
  status: "waiting" | "on_progress" | "completed" | "cancelled" | "returned";
  technician_id?: number;
  technician_name?: string;
  technician_phone?: string;
  cost_estimation?: number;
  final_cost?: number;
}
