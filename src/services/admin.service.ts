import { BaseApiClient } from "./base";
import type { ApiResponse, User, DashboardStats, ReportData } from "@/types";

class AdminService extends BaseApiClient {
  async getDashboardStats(): Promise<DashboardStats> {
    const response =
      await this.request<ApiResponse<DashboardStats>>("/admin/dashboard");
    return this.extractData(response);
  }

  async getAllUsers(): Promise<User[]> {
    const response = await this.request<ApiResponse<User[]>>("/admin/users");
    return this.extractData(response);
  }

  async getReports(): Promise<ReportData> {
    const response =
      await this.request<ApiResponse<ReportData>>("/admin/reports");
    return this.extractData(response);
  }
}

export const adminService = new AdminService();
