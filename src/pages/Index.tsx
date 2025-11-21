import { useState } from "react";
import Header from "@/components/Header";
import VehicleCard from "@/components/VehicleCard";
import FilterSidebar from "@/components/FilterSidebar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { mockVehicles, fuelTypeLabels } from "@/data/mockVehicles";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    brand: "Todas",
    minPrice: 10000,
    maxPrice: 50000,
    fuelType: "Todos",
    minYear: 2000,
    maxYear: 2024,
  });

  const filteredVehicles = mockVehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBrand = filters.brand === "Todas" || vehicle.brand === filters.brand;
    
    const matchesFuel = 
      filters.fuelType === "Todos" || 
      fuelTypeLabels[vehicle.fuel_type] === filters.fuelType;

    const matchesPrice =
      vehicle.ad_price >= filters.minPrice && vehicle.ad_price <= filters.maxPrice;

    const matchesYear =
      vehicle.year_manufacture >= filters.minYear && vehicle.year_manufacture <= filters.maxYear;

    return matchesSearch && matchesBrand && matchesFuel && matchesPrice && matchesYear;
  });

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      {/* Hero Section */}
      <section className="gradient-primary py-16 text-center text-primary-foreground">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Encontre o Carro dos Seus Sonhos
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Preços honestos, carros confiáveis. Seu próximo carro está aqui!
          </p>

          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por marca ou modelo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 bg-background text-foreground"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container py-8">
        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Filters */}
          <aside className="hidden lg:block">
            <FilterSidebar filters={filters} onFilterChange={setFilters} />
          </aside>

          {/* Vehicle Grid */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">
                Veículos Disponíveis
              </h2>
              <p className="text-muted-foreground">
                {filteredVehicles.length} {filteredVehicles.length === 1 ? 'veículo encontrado' : 'veículos encontrados'}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.vehicle_id} vehicle={vehicle} />
              ))}
            </div>

            {filteredVehicles.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  Nenhum veículo encontrado com os filtros selecionados.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;