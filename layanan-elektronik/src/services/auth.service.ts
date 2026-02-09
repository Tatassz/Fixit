import { BaseApiClient } from "./base";
import type {
  LoginResponse,
  RegisterResponse,
  RegisterData,
  ApiResponse,
} from "@/types";

class AuthService extends BaseApiClient {
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
      response.data.token ||
      this.generateFallbackToken("usr", response.data.user.id);

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

  private generateFallbackToken(prefix: string, id: number): string {
    return `${prefix}_${id}_${Date.now()}_mock`;
  }
}

export const authService = new AuthService();
