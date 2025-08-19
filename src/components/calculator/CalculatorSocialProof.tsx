import { Card, CardContent } from "@/components/ui/card";
import { Star, TrendingUp, Users, Clock } from "lucide-react";

const CalculatorSocialProof = () => {
  const metrics = [
    {
      icon: <TrendingUp className="h-8 w-8 text-success" />,
      value: "R$ 47k",
      label: "Perdas médias descobertas"
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      value: "500+",
      label: "Empresas calcularam"
    },
    {
      icon: <Clock className="h-8 w-8 text-bvbp-corporate" />,
      value: "3 min",
      label: "Tempo médio de cálculo"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Empresas que usaram nossa calculadora descobriram 
            perdas médias de <span className="text-destructive">R$ 47 mil/mês</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          {metrics.map((metric, index) => (
            <Card key={index} className="text-center border-2 hover:border-primary/20 transition-colors">
              <CardContent className="pt-8 pb-6">
                <div className="flex justify-center mb-4">
                  {metric.icon}
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">
                  {metric.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {metric.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="max-w-4xl mx-auto bg-gradient-subtle border-2">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              ))}
            </div>
            
            <blockquote className="text-xl lg:text-2xl font-medium text-foreground mb-4 italic">
              "O relatório abriu nossos olhos para problemas que nem sabíamos que tínhamos. 
              Descobrimos que estávamos perdendo R$ 52 mil por mês só com reuniões improdutivas e retrabalho."
            </blockquote>
            
            <div className="flex items-center justify-center gap-4">
              <div className="text-right">
                <div className="font-semibold text-foreground">CEO, Tech Company</div>
                <div className="text-sm text-muted-foreground">200+ funcionários • São Paulo</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-success/10 text-success rounded-full">
            <TrendingUp className="h-5 w-5" />
            <span className="font-semibold">Média de economia implementada: 35% das perdas identificadas</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalculatorSocialProof;