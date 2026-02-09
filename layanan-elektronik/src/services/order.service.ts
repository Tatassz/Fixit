import { BaseApiClient } from "./base";
import type {
  Order,
  CreateOrderData,
  UpdateOrderStatusData,
  ApiResponse,
} from "@/types";

class OrderService extends BaseApiClient {
  async create(data: CreateOrderData): Promise<Order> {
    const response = await this.request<ApiResponse<Order>>("/orders/", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return this.extractData(response);
  }

  async getMyOrders(): Promise<Order[]> {
    const response = await this.request<ApiResponse<Order[]>>("/orders/user");
    return this.extractData(response);
  }

  async getById(id: string): Promise<Order> {
    const response = await this.request<ApiResponse<Order>>(`/orders/${id}`);
    return this.extractData(response);
  }

  async getTracking(id: string): Promise<any> {
    const response = await this.request<ApiResponse<any>>(
      `/orders/${id}/tracking`,
    );
    return this.extractData(response);
  }

  async cancel(id: string): Promise<void> {
    await this.request(`/orders/${id}`, {
      method: "DELETE",
    });
  }

  async getAll(): Promise<Order[]> {
    const response = await this.request<ApiResponse<Order[]>>("/orders/");
    return this.extractData(response);
  }

  async updateStatus(id: string, data: UpdateOrderStatusData): Promise<Order> {
    const response = await this.request<ApiResponse<Order>>(
      `/orders/${id}/status`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
    );
    return this.extractData(response);
  }
}

export const orderService = new OrderService();
