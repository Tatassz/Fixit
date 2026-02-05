import type { ApiResponse } from "@/types";

export const API_BASE_URL = "https://try2fixit.idlabs.cloud";

export class BaseApiClient {
  protected baseUrl: string;
  protected token: string | null = null;

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

  getToken(): string | null {
    return this.token;
  }

  protected async request<T>(
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

  protected extractData<T>(response: ApiResponse<T>): T {
    if (!response.data) {
      throw new Error("Data tidak ditemukan dalam response");
    }
    return response.data;
  }
}
