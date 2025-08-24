import { Card, CardContent } from "@/components/ui/card";
import { Star, TrendingUp, Users, Clock } from "lucide-react";
const CalculatorSocialProof = () => {
  const metrics = [{
    icon: <TrendingUp className="h-8 w-8 text-success" />,
    value: "R$ 47k",
    label: "Perdas médias descobertas"
  }, {
    icon: <Users className="h-8 w-8 text-primary" />,
    value: "500+",
    label: "Empresas calcularam"
  }, {
    icon: <Clock className="h-8 w-8 text-bvbp-corporate" />,
    value: "3 min",
    label: "Tempo médio de cálculo"
  }];
  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Calculadora Confiável</h2>
          <p className="text-muted-foreground">Dados baseados em experiência real com empresas brasileiras</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {metrics.map((metric, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  {metric.icon}
                </div>
                <div className="text-3xl font-bold mb-2">{metric.value}</div>
                <div className="text-muted-foreground">{metric.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
export default CalculatorSocialProof;