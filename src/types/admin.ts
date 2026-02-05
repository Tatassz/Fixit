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
