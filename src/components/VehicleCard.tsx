import { Car, Fuel, Gauge } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Vehicle } from "@/types/vehicle";
import { fuelTypeLabels } from "@/types/vehicle";
import { useNavigate } from "react-router-dom";

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard = ({ vehicle }: VehicleCardProps) => {
  const navigate = useNavigate();

  const discount = Math.round(((vehicle.fipe_price - vehicle.ad_price) / vehicle.fipe_price) * 100);

  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-hover transition-all duration-300 hover:-translate-y-1"
      onClick={() => navigate(`/veiculo/${vehicle.vehicle_id}`)}
    >
      <div className="relative">
        <img
          src={vehicle.photos[0]}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-48 object-cover"
        />
        {discount > 0 && (
          <Badge className="absolute top-2 right-2 bg-secondary text-secondary-foreground">
            -{discount}% FIPE
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-bold text-lg line-clamp-1">
              {vehicle.brand} {vehicle.model}
            </h3>
            <p className="text-sm text-muted-foreground">{vehicle.year_manufacture}</p>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Gauge className="h-4 w-4" />
              <span>{(vehicle.mileage / 1000).toFixed(0)}k km</span>
            </div>
            <div className="flex items-center gap-1">
              <Fuel className="h-4 w-4" />
              <span>{fuelTypeLabels[vehicle.fuel_type]}</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {vehicle.simple_description}
          </p>

          <div className="flex items-baseline gap-2 pt-2 border-t">
            <span className="text-2xl font-bold text-primary">
              R$ {vehicle.ad_price.toLocaleString('pt-BR')}
            </span>
            <span className="text-xs text-muted-foreground line-through">
              R$ {vehicle.fipe_price.toLocaleString('pt-BR')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleCard;