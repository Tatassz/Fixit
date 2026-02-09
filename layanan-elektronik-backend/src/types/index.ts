export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  role?: string;
  created_at: string;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  price_start: number;
  estimated_time: string;
  status: 'active' | 'inactive';
}

export type OrderStatus = 'waiting' | 'on_progress' | 'completed' | 'cancelled';

export interface Order {
  order_id: number;
  user_id: number;
  service_id: number;
  service_name?: string;
  device_brand: string;
  device_type: string;
  problem_description: string;
  device_photo?: string;
  address: string;
  status: OrderStatus;
  technician_id?: number;
  technician_name?: string;
  technician_phone?: string;
  cost_estimation?: number;
  final_cost?: number;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  payment_id: string;
  order_id: number;
  amount: number;
  payment_method: string;
  status: 'pending' | 'paid' | 'failed';
  created_at: string;
  paid_at?: string;
}

export interface DashboardStats {
  total_users: number;
  total_technicians: number;
  total_orders: number;
  pending_orders: number;
  completed_orders: number;
  total_revenue: number;
  monthly_revenue: number;
}

export interface ReportData {
  orders_summary: {
    total: number;
    completed: number;
    on_progress: number;
    waiting: number;
    cancelled: number;
  };
  total_revenue: number;
  revenue_by_service: Array<{
    service_id: number;
    service_name: string;
    total_orders: number;
    revenue: number;
  }>;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
