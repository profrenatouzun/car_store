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

export const mockVehicles: Vehicle[] = [
  {
    vehicle_id: 1,
    brand: 'Fiat',
    model: 'Uno Mille',
    year_manufacture: 2010,
    fuel_type: 'F',
    simple_description: 'Carro econômico, ótimo para o dia a dia. Aceito propostas!',
    mileage: 150000,
    ad_price: 18500,
    fipe_price: 19200,
    items: ['Direção hidráulica', 'Ar condicionado', 'Vidros elétricos'],
    photos: [
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
    ],
  },
  {
    vehicle_id: 2,
    brand: 'Volkswagen',
    model: 'Gol G4',
    year_manufacture: 2012,
    fuel_type: 'F',
    simple_description: 'Gol 1.0 em ótimo estado, revisões em dia.',
    mileage: 120000,
    ad_price: 22000,
    fipe_price: 23500,
    items: ['Direção hidráulica', 'Vidros elétricos', 'Travas elétricas'],
    photos: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800',
    ],
  },
  {
    vehicle_id: 3,
    brand: 'Chevrolet',
    model: 'Celta',
    year_manufacture: 2011,
    fuel_type: 'F',
    simple_description: 'Celta básico, super econômico. Perfeito para quem quer economizar.',
    mileage: 135000,
    ad_price: 17800,
    fipe_price: 18900,
    items: ['Direção mecânica'],
    photos: [
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800',
    ],
  },
  {
    vehicle_id: 4,
    brand: 'Ford',
    model: 'Ka',
    year_manufacture: 2013,
    fuel_type: 'F',
    simple_description: 'Ka em excelente estado, único dono, IPVA 2024 pago.',
    mileage: 98000,
    ad_price: 24500,
    fipe_price: 26000,
    items: ['Ar condicionado', 'Direção hidráulica', 'Vidros elétricos', 'Alarme'],
    photos: [
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800',
      'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800',
    ],
  },
  {
    vehicle_id: 5,
    brand: 'Fiat',
    model: 'Palio',
    year_manufacture: 2014,
    fuel_type: 'F',
    simple_description: 'Palio Fire completo, ar gelando, pneus novos.',
    mileage: 110000,
    ad_price: 26800,
    fipe_price: 28500,
    items: ['Ar condicionado', 'Direção hidráulica', 'Vidros elétricos', 'Travas elétricas', 'Som Bluetooth'],
    photos: [
      'https://images.unsplash.com/photo-1494905998402-395d579af36f?w=800',
      'https://images.unsplash.com/photo-1486496146582-9ffcd0b2b2b7?w=800',
    ],
  },
  {
    vehicle_id: 6,
    brand: 'Volkswagen',
    model: 'Fox',
    year_manufacture: 2015,
    fuel_type: 'F',
    simple_description: 'Fox 1.6 muito conservado, sem detalhes.',
    mileage: 85000,
    ad_price: 32500,
    fipe_price: 34000,
    items: ['Ar condicionado', 'Direção hidráulica', 'Vidros elétricos', 'Travas elétricas', 'Airbag', 'ABS'],
    photos: [
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800',
    ],
  },
  {
    vehicle_id: 7,
    brand: 'Chevrolet',
    model: 'Onix',
    year_manufacture: 2016,
    fuel_type: 'F',
    simple_description: 'Onix 1.0 LT, carro de garagem, bem cuidado.',
    mileage: 72000,
    ad_price: 38900,
    fipe_price: 41000,
    items: ['Ar condicionado', 'Direção elétrica', 'Vidros elétricos', 'Travas elétricas', 'Airbag', 'ABS', 'Multimídia'],
    photos: [
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800',
    ],
  },
  {
    vehicle_id: 8,
    brand: 'Renault',
    model: 'Sandero',
    year_manufacture: 2014,
    fuel_type: 'F',
    simple_description: 'Sandero Authentique, espaçoso e econômico.',
    mileage: 105000,
    ad_price: 28500,
    fipe_price: 30000,
    items: ['Direção hidráulica', 'Vidros elétricos dianteiros'],
    photos: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
    ],
  },
];