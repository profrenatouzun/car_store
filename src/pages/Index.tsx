import { useState, useMemo } from "react";
import Header from "@/components/Header";
import VehicleCard from "@/components/VehicleCard";
import FilterSidebar from "@/components/FilterSidebar";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { useVehicles } from "@/hooks/useVehicles";
import { fuelTypeLabels } from "@/types/vehicle";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    brand: "Todas",
    minPrice: 5000,
    maxPrice: 30000,
    fuelType: "Todos",
    minYear: 1996,
    maxYear: 2008,
  });

  // Preparar filtros para a API
  const apiFilters = useMemo(() => {
    const apiFilter: any = {
      min_price: filters.minPrice,
      max_price: filters.maxPrice,
      min_year: filters.minYear,
      max_year: filters.maxYear,
    };

    if (filters.brand !== "Todas") {
      apiFilter.brand = filters.brand;
    }

    if (filters.fuelType !== "Todos") {
      // Converter label para código
      const fuelCode = Object.entries(fuelTypeLabels).find(
        ([_, label]) => label === filters.fuelType
      )?.[0];
      if (fuelCode) {
        apiFilter.fuel_type = fuelCode;
      }
    }

    return apiFilter;
  }, [filters]);

  const { data: vehicles = [], isLoading, error } = useVehicles(apiFilters);

  // Filtrar por termo de busca no frontend (já que a API não tem esse filtro)
  const filteredVehicles = useMemo(() => {
    if (!searchTerm) return vehicles;

    const searchLower = searchTerm.toLowerCase();
    return vehicles.filter(
      (vehicle) =>
        vehicle.brand.toLowerCase().includes(searchLower) ||
        vehicle.model.toLowerCase().includes(searchLower)
    );
  }, [vehicles, searchTerm]);

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      {/* Hero Section */}
      <section className="gradient-primary py-16 text-center text-primary-foreground">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Sua Lata Véia Está Aqui!
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Carros antigos de 1996 a 2008. Clássicos acessíveis e confiáveis!
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
                {isLoading ? (
                  "Carregando..."
                ) : error ? (
                  "Erro ao carregar veículos"
                ) : (
                  <>
                    {filteredVehicles.length} {filteredVehicles.length === 1 ? 'veículo encontrado' : 'veículos encontrados'}
                  </>
                )}
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  Erro ao carregar veículos. Verifique se a API está rodando.
                </p>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;