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

export const fuelTypeLabels = {
  G: 'Gasolina',
  A: 'Álcool',
  D: 'Diesel',
  F: 'Flex',
};


