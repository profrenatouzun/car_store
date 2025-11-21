import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockVehicles, fuelTypeLabels } from "@/data/mockVehicles";
import { ArrowLeft, Calendar, Fuel, Gauge, Check, Phone, MessageCircle } from "lucide-react";

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const vehicle = mockVehicles.find((v) => v.vehicle_id === parseInt(id || "0"));

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Veículo não encontrado</h1>
          <Button onClick={() => navigate("/")}>Voltar para a lista</Button>
        </div>
      </div>
    );
  }

  const discount = Math.round(((vehicle.fipe_price - vehicle.ad_price) / vehicle.fipe_price) * 100);

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      <div className="container py-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <div className="grid lg:grid-cols-[1fr_400px] gap-6">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <img
                src={vehicle.photos[0]}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="w-full h-96 object-cover"
              />
              {vehicle.photos.length > 1 && (
                <CardContent className="p-4">
                  <div className="grid grid-cols-4 gap-2">
                    {vehicle.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-75 transition-opacity"
                      />
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Vehicle Info */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h1 className="text-3xl font-bold">
                        {vehicle.brand} {vehicle.model}
                      </h1>
                      <p className="text-muted-foreground">{vehicle.year_manufacture}</p>
                    </div>
                    {discount > 0 && (
                      <Badge className="bg-secondary text-secondary-foreground text-lg px-4 py-2">
                        -{discount}% FIPE
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-6 text-muted-foreground mt-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      <span>{vehicle.year_manufacture}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gauge className="h-5 w-5" />
                      <span>{vehicle.mileage.toLocaleString('pt-BR')} km</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Fuel className="h-5 w-5" />
                      <span>{fuelTypeLabels[vehicle.fuel_type]}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <h2 className="text-xl font-bold mb-3">Descrição</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {vehicle.simple_description}
                  </p>
                </div>

                <div className="pt-6 border-t">
                  <h2 className="text-xl font-bold mb-3">Itens e Acessórios</h2>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {vehicle.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-20">
              <CardContent className="p-6 space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Preço Anunciado</p>
                  <p className="text-4xl font-bold text-primary">
                    R$ {vehicle.ad_price.toLocaleString('pt-BR')}
                  </p>
                  <p className="text-sm text-muted-foreground line-through mt-1">
                    FIPE: R$ {vehicle.fipe_price.toLocaleString('pt-BR')}
                  </p>
                </div>

                <div className="space-y-3">
                  <Button className="w-full gradient-accent" size="lg">
                    <Phone className="h-5 w-5 mr-2" />
                    Ver Telefone
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Enviar Mensagem
                  </Button>
                </div>

                <div className="pt-6 border-t space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vendedor</span>
                    <span className="font-medium">Vendas de Lata Veia</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Localização</span>
                    <span className="font-medium">São Paulo, SP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Anunciado em</span>
                    <span className="font-medium">Hoje</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;