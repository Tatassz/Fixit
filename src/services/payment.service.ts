import { BaseApiClient } from "./base";
import type { Payment, ApiResponse } from "@/types";

class PaymentService extends BaseApiClient {
  async create(orderId: number, paymentMethod: string): Promise<Payment> {
    const response = await this.request<ApiResponse<Payment>>("/payments/", {
      method: "POST",
      body: JSON.stringify({
        order_id: orderId,
        payment_method: paymentMethod,
      }),
    });
    return this.extractData(response);
  }

  async getById(id: string): Promise<Payment> {
    const response = await this.request<ApiResponse<Payment>>(
      `/payments/${id}`,
    );
    return this.extractData(response);
  }

  async getByOrder(orderId: string): Promise<Payment[]> {
    const response = await this.request<ApiResponse<Payment[]>>(
      `/payments/order/${orderId}`,
    );
    return this.extractData(response);
  }

  async confirm(id: string): Promise<Payment> {
    const response = await this.request<ApiResponse<Payment>>(
      `/payments/${id}/confirm`,
      {
        method: "PUT",
      },
    );
    return this.extractData(response);
  }
}

export const paymentService = new PaymentService();
