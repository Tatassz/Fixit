import { BaseApiClient } from "./base";
import type { UpdateProfileData, ApiResponse, User } from "@/types";

class UserService extends BaseApiClient {
  async getProfile(): Promise<User> {
    const response = await this.request<ApiResponse<User>>("/user/profile");
    return this.extractData(response);
  }

  async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await this.request<ApiResponse<User>>("/user/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return this.extractData(response);
  }
}

export const userService = new UserService();
