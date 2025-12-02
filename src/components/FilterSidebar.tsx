import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import { Button } from "./ui/button";
import { SlidersHorizontal } from "lucide-react";
import { useBrands, useFuelTypes } from "@/hooks/useVehicles";
import { fuelTypeLabels } from "@/types/vehicle";

interface FilterSidebarProps {
  filters: {
    brand: string;
    minPrice: number;
    maxPrice: number;
    fuelType: string;
    minYear: number;
    maxYear: number;
  };
  onFilterChange: (filters: any) => void;
}

const FilterSidebar = ({ filters, onFilterChange }: FilterSidebarProps) => {
  const { data: brandsData = [] } = useBrands();
  const { data: fuelTypesData = [] } = useFuelTypes();

  const brands = ['Todas', ...brandsData.map((b: any) => b.name)];
  const fuelTypes = ['Todos', ...Object.values(fuelTypeLabels)];

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5" />
          Filtros
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Marca</Label>
          <Select
            value={filters.brand}
            onValueChange={(value) => onFilterChange({ ...filters, brand: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Combustível</Label>
          <Select
            value={filters.fuelType}
            onValueChange={(value) => onFilterChange({ ...filters, fuelType: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fuelTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Preço Máximo</Label>
          <div className="space-y-3">
            <Slider
              value={[filters.maxPrice]}
              onValueChange={([value]) => onFilterChange({ ...filters, maxPrice: value })}
              max={30000}
              min={5000}
              step={500}
            />
            <div className="text-sm text-muted-foreground text-center">
              até R$ {filters.maxPrice.toLocaleString('pt-BR')}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Ano</Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">De</Label>
              <Input
                type="number"
                value={filters.minYear}
                onChange={(e) => onFilterChange({ ...filters, minYear: parseInt(e.target.value) || 1996 })}
                min={1996}
                max={2008}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Até</Label>
              <Input
                type="number"
                value={filters.maxYear}
                onChange={(e) => onFilterChange({ ...filters, maxYear: parseInt(e.target.value) || 2008 })}
                min={1996}
                max={2008}
              />
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => onFilterChange({
            brand: 'Todas',
            minPrice: 5000,
            maxPrice: 30000,
            fuelType: 'Todos',
            minYear: 1996,
            maxYear: 2008,
          })}
        >
          Limpar Filtros
        </Button>
      </CardContent>
    </Card>
  );
};

export default FilterSidebar;