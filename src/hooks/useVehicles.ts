import { useQuery } from '@tanstack/react-query';
import { api, Vehicle, VehicleFilters } from '@/services/api';

export const useVehicles = (filters?: VehicleFilters) => {
  return useQuery({
    queryKey: ['vehicles', filters],
    queryFn: () => api.getVehicles(filters),
  });
};

export const useVehicle = (id: number) => {
  return useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => api.getVehicleById(id),
    enabled: !!id,
  });
};

export const useBrands = () => {
  return useQuery({
    queryKey: ['brands'],
    queryFn: () => api.getBrands(),
  });
};

export const useModels = (brandId?: number) => {
  return useQuery({
    queryKey: ['models', brandId],
    queryFn: () => api.getModels(brandId),
    enabled: brandId !== undefined,
  });
};

export const useFuelTypes = () => {
  return useQuery({
    queryKey: ['fuelTypes'],
    queryFn: () => api.getFuelTypes(),
  });
};

export type { Vehicle, VehicleFilters };


