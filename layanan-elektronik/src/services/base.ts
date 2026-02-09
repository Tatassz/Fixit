import type { ApiResponse } from "@/types";

export const API_BASE_URL = "http://localhost:3000";

export class BaseApiClient {
  protected baseUrl: string;
  protected token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token");
      console.log(
        "🔧 BaseApiClient: Constructor - token exists?",
        !!this.token,
      );
    }
  }

  setToken(token: string) {
    console.log(
      "🔑 BaseApiClient: setToken() called, token length:",
      token.length,
    );
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
      console.log("✅ BaseApiClient: Token saved to localStorage");
    }
  }

  clearToken() {
    console.log("🗑️ BaseApiClient: clearToken() called");
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
    console.log("🌐 BaseApiClient: Making request to:", endpoint);

    // ✅ Read token fresh from localStorage on every request
    const currentToken =
      typeof window !== "undefined"
        ? localStorage.getItem("auth_token")
        : this.token;

    console.log("🔑 BaseApiClient: Current token exists?", !!currentToken);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (currentToken) {
      headers["Authorization"] = `Bearer ${currentToken}`;
      console.log("✅ BaseApiClient: Authorization header added");
    } else {
      console.warn("⚠️ BaseApiClient: No token available for request!");
    }

    const url = `${this.baseUrl}${endpoint}`;
    console.log("📡 BaseApiClient: Full URL:", url);

    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log("📥 BaseApiClient: Response status:", response.status);

    const jsonData = await response.json();

    if (!response.ok) {
      console.error(
        "❌ BaseApiClient: Request failed:",
        jsonData.message || response.statusText,
      );
      throw new Error(jsonData.message || `API Error: ${response.statusText}`);
    }

    console.log("✅ BaseApiClient: Request successful");
    return jsonData;
  }

  protected extractData<T>(response: ApiResponse<T>): T {
    if (!response.data) {
      throw new Error("Data tidak ditemukan dalam response");
    }
    return response.data;
  }
}
