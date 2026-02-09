import { BaseApiClient } from "./base";
import type {
  Service,
  CreateServiceData,
  UpdateServiceData,
  ApiResponse,
} from "@/types";

class ServiceService extends BaseApiClient {
  async getAll(): Promise<Service[]> {
    const response = await this.request<ApiResponse<Service[]>>("/services/");
    return this.extractData(response);
  }

  async getById(id: string): Promise<Service> {
    const response = await this.request<ApiResponse<Service>>(
      `/services/${id}`,
    );
    return this.extractData(response);
  }

  async create(data: CreateServiceData): Promise<Service> {
    const response = await this.request<ApiResponse<Service>>("/services/", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return this.extractData(response);
  }

  async update(id: string, data: UpdateServiceData): Promise<Service> {
    const response = await this.request<ApiResponse<Service>>(
      `/services/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
    );
    return this.extractData(response);
  }

  async delete(id: string): Promise<void> {
    await this.request(`/services/${id}`, {
      method: "DELETE",
    });
  }
}

export const serviceService = new ServiceService();
