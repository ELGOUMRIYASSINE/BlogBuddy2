import { apiRequest } from "./queryClient";

export interface User {
  id: number;
  username: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ success: boolean; user: User }> {
    const response = await apiRequest("POST", "/api/auth/login", credentials);
    return response.json();
  },

  async logout(): Promise<void> {
    await apiRequest("POST", "/api/auth/logout");
  },

  async getMe(): Promise<{ isAuthenticated: boolean; userId?: number }> {
    try {
      const response = await apiRequest("GET", "/api/auth/me");
      return response.json();
    } catch {
      return { isAuthenticated: false };
    }
  }
};
