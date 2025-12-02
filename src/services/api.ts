import { API_CONFIG } from '@/config/api';

const API_BASE_URL = API_CONFIG.baseURL;

export interface Vehicle {
  vehicle_id: number;
  brand: string;
  model: string;
  year_manufacture: number;
  fuel_type: 'G' | 'A' | 'D' | 'F';
  simple_description: string;
  mileage: number;
  ad_price: number;
  fipe_price: number;
  items: string[];
  photos: string[];
}

export interface VehicleFilters {
  brand?: string;
  model?: string;
  fuel_type?: 'G' | 'A' | 'D' | 'F';
  min_price?: number;
  max_price?: number;
  min_year?: number;
  max_year?: number;
  limit?: number;
  offset?: number;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Vehicles
  async getVehicles(filters?: VehicleFilters): Promise<Vehicle[]> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const queryString = params.toString();
    return this.request<Vehicle[]>(`/vehicles${queryString ? `?${queryString}` : ''}`);
  }

  async getVehicleById(id: number): Promise<Vehicle> {
    return this.request<Vehicle>(`/vehicles/${id}`);
  }

  // Brands
  async getBrands() {
    return this.request('/brands');
  }

  // Models
  async getModels(brandId?: number) {
    const params = brandId ? `?brand_id=${brandId}` : '';
    return this.request(`/models${params}`);
  }

  // Fuel Types
  async getFuelTypes() {
    return this.request('/fuel-types');
  }
}

export const api = new ApiService();

