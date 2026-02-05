import type {
  LoginResponse,
  RegisterResponse,
  RegisterData,
  CreateOrderData,
  UpdateOrderStatusData,
  CreateServiceData,
  UpdateServiceData,
  UpdateProfileData,
  ApiResponse,
} from "@/types";

export const API_BASE_URL = "http://localhost:3000";

export class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token");
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    const jsonData = await response.json();

    if (!response.ok) {
      throw new Error(jsonData.message || `API Error: ${response.statusText}`);
    }

    return jsonData;
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.request<
      ApiResponse<{ token: string; user: any }>
    >("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (!response.data?.token) {
      throw new Error("Token tidak ditemukan dalam response");
    }

    return {
      token: response.data.token,
      user: response.data.user,
    };
  }

  async register(data: RegisterData): Promise<RegisterResponse> {
    const response = await this.request<
      ApiResponse<{ user: any; token?: string }>
    >("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.data?.user) {
      throw new Error("Data user tidak ditemukan dalam response");
    }

    const token =
      response.data.token || generateToken("usr", response.data.user.id);

    return {
      token,
      user: response.data.user,
    };
  }

  async adminLogin(email: string, password: string): Promise<LoginResponse> {
    const response = await this.request<
      ApiResponse<{ token: string; admin: any }>
    >("/auth/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (!response.data?.token) {
      throw new Error("Token tidak ditemukan dalam response");
    }

    return {
      token: response.data.token,
      user: response.data.admin,
    };
  }

  async getProfile() {
    return this.request("/user/profile");
  }

  async updateProfile(data: UpdateProfileData) {
    return this.request("/user/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async getServices() {
    return this.request("/services/");
  }

  async getServiceById(id: string) {
    return this.request(`/services/${id}`);
  }

  async createOrder(data: CreateOrderData) {
    return this.request("/orders/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getMyOrders() {
    return this.request("/orders/user");
  }

  async getOrderById(id: string) {
    return this.request(`/orders/${id}`);
  }

  async getOrderTracking(id: string) {
    return this.request(`/orders/${id}/tracking`);
  }

  async cancelOrder(id: string) {
    return this.request(`/orders/${id}`, {
      method: "DELETE",
    });
  }

  async createPayment(orderId: number, paymentMethod: string) {
    return this.request("/payments/", {
      method: "POST",
      body: JSON.stringify({
        order_id: orderId,
        payment_method: paymentMethod,
      }),
    });
  }

  async getPaymentById(id: string) {
    return this.request(`/payments/${id}`);
  }

  async getPaymentsByOrder(orderId: string) {
    return this.request(`/payments/order/${orderId}`);
  }

  async getDashboardStats() {
    return this.request("/admin/dashboard");
  }

  async getAllOrders() {
    return this.request("/orders/");
  }

  async updateOrderStatus(id: string, data: UpdateOrderStatusData) {
    return this.request(`/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async getAllUsers() {
    return this.request("/admin/users");
  }

  async getReports() {
    return this.request("/admin/reports");
  }

  async createService(data: CreateServiceData) {
    return this.request("/services/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateService(id: string, data: UpdateServiceData) {
    return this.request(`/services/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteService(id: string) {
    return this.request(`/services/${id}`, {
      method: "DELETE",
    });
  }

  async confirmPayment(id: string) {
    return this.request(`/payments/${id}/confirm`, {
      method: "PUT",
    });
  }
}

function generateToken(prefix: string, id: number): string {
  return `${prefix}_${id}_${Date.now()}_mock`;
}

export const api = new ApiClient();
