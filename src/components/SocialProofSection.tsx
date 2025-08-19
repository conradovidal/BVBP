import { Card } from "@/components/ui/card";
import { Star, TrendingUp, Clock, DollarSign, Target } from "lucide-react";
import metricsImage from "@/assets/metrics-dashboard.jpg";

const SocialProofSection = () => {
  const metrics = [
    {
      icon: TrendingUp,
      value: "25-40%",
      label: "Redução Tempo Operacional",
      color: "text-bvbp-growth"
    },
    {
      icon: Target,
      value: "70%",
      label: "Menos Firefighting para CEOs",
      color: "text-bvbp-corporate"
    },
    {
      icon: Clock,
      value: "90 dias",
      label: "Para Autonomia Completa",
      color: "text-bvbp-growth"
    },
    {
      icon: DollarSign,
      value: "R$ 30-50k",
      label: "Economia Mensal Média",
      color: "text-bvbp-corporate"
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-4">
            Resultados Reais de Empresas Reais
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Dados comprovados de transformações que geraram impacto real no bottom-line dos nossos clientes
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {metrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <Card key={index} className="p-6 text-center hover:shadow-soft transition-smooth">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-gradient-subtle">
                    <IconComponent className={`h-8 w-8 ${metric.color}`} />
                  </div>
                </div>
                <div className={`text-3xl font-bold mb-2 ${metric.color}`}>
                  {metric.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {metric.label}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Testimonial Card */}
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 md:p-12 bg-gradient-subtle border-0 shadow-soft">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                {/* Stars */}
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-bvbp-growth fill-current" />
                  ))}
                </div>
                
                {/* Testimonial */}
                <blockquote className="text-lg md:text-xl text-foreground font-medium leading-relaxed mb-6">
                  "Recuperamos 35% do tempo perdido em reuniões improdutivas. 
                  O melhor: hoje somos autônomos para evoluir os processos."
                </blockquote>
                
                {/* Attribution */}
                <div className="border-l-4 border-bvbp-growth pl-4">
                  <div className="font-semibold text-bvbp-corporate">CEO</div>
                  <div className="text-sm text-muted-foreground">Empresa de Tecnologia (200+ funcionários)</div>
                </div>
              </div>
              
              {/* Dashboard Image */}
              <div className="relative">
                <div className="rounded-xl overflow-hidden shadow-soft">
                  <img 
                    src={metricsImage} 
                    alt="Dashboard mostrando métricas de melhoria de processos" 
                    className="w-full h-auto"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-bvbp-corporate/10 to-bvbp-growth/10 rounded-xl" />
              </div>
            </div>
          </Card>
        </div>

        {/* Trust Logos Placeholder */}
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground mb-6">
            Empresas que confiam na BVBP
          </p>
          <div className="flex justify-center items-center space-x-8 opacity-60 grayscale">
            {[1, 2, 3, 4, 5].map((logo) => (
              <div key={logo} className="w-20 h-12 bg-muted rounded flex items-center justify-center">
                <div className="text-xs font-semibold text-muted-foreground">Logo {logo}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;