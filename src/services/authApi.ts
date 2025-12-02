import { API_CONFIG } from '@/config/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  customer: {
    id: number;
    name: string;
    email: string;
  };
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const authApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_CONFIG.baseURL}/customers/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao fazer login');
    }

    return response.json();
  },

  async changePassword(customerId: number, currentPassword: string, newPassword: string): Promise<void> {
    const response = await fetch(`${API_CONFIG.baseURL}/customers/${customerId}/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao alterar senha');
    }
  },
};

