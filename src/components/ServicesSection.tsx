import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, DollarSign, Star, Zap, TrendingUp, Crown } from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      title: "DIAGNÓSTICO GRATUITO",
      badge: "GRÁTIS",
      badgeColor: "bg-bvbp-growth text-white",
      price: "R$ 0",
      duration: "2 semanas",
      icon: Zap,
      description: "Mapeamento completo dos gaps e oportunidades de economia",
      features: [
        "Mapeamento completo dos gaps",
        "Relatório executivo com oportunidades",
        "Potencial de economia identificado",
        "Análise de processos críticos",
        "Roadmap personalizado"
      ],
      cta: "AGENDAR AGORA",
      popular: false
    },
    {
      title: "QUICK WIN",
      badge: "MAIS POPULAR",
      badgeColor: "bg-orange-500 text-white",
      price: "R$ 6.500",
      duration: "4 semanas",
      icon: TrendingUp,
      description: "Resultados rápidos no processo mais crítico da sua empresa",
      features: [
        "1 processo crítico redesenhado",
        "Quick wins imediatos implementados",
        "Métricas de acompanhamento",
        "Treinamento da equipe",
        "30 dias de suporte incluído"
      ],
      cta: "SAIBA MAIS",
      popular: true
    },
    {
      title: "MOMENTUM",
      badge: "RECOMENDADO",
      badgeColor: "bg-bvbp-corporate text-white",
      price: "R$ 12.500",
      duration: "8 semanas",
      icon: Star,
      description: "Transformação sistêmica com métricas e automação simples",
      features: [
        "Métricas + Automação simples",
        "ROI transparente + controle contínuo",
        "3-5 processos otimizados",
        "Dashboard de acompanhamento",
        "60 dias de suporte incluído"
      ],
      cta: "QUERO ESTE",
      popular: false
    },
    {
      title: "TRANSFORMATION",
      badge: "PREMIUM",
      badgeColor: "bg-gradient-hero text-white",
      price: "R$ 22.000",
      duration: "12 semanas",
      icon: Crown,
      description: "Mudança sistêmica completa com 6 meses de suporte",
      features: [
        "Mudança sistêmica + 6 meses suporte",
        "Capacitação completa da equipe",
        "Todos os processos otimizados",
        "Autonomia total garantida",
        "ROI médio de 300%+ no primeiro ano"
      ],
      cta: "TRANSFORMAR AGORA",
      popular: false
    }
  ];

  return (
    <section id="servicos" className="py-16 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-4">
            Nossos Serviços (Jornada Modular)
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Escolha o nível de transformação ideal para sua empresa. Todos os serviços incluem 
            nossa garantia de resultados mensuráveis
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card 
                key={index} 
                className={`relative p-6 h-full flex flex-col hover:shadow-strong transition-smooth ${
                  service.popular ? 'ring-2 ring-bvbp-growth scale-105' : ''
                }`}
              >
                {/* Badge */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className={service.badgeColor}>
                    {service.badge}
                  </Badge>
                </div>

                {/* Header */}
                <div className="text-center mb-6 pt-4">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${
                    service.popular ? 'bg-gradient-success' : 'bg-gradient-hero'
                  }`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  
                  <h3 className="font-heading text-lg font-bold text-bvbp-corporate mb-2">
                    {service.title}
                  </h3>
                  
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className={`text-2xl font-bold ${
                      service.price === "R$ 0" ? 'text-bvbp-growth' : 'text-bvbp-corporate'
                    }`}>
                      {service.price}
                    </span>
                    <div className="text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 inline mr-1" />
                      {service.duration}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {service.description}
                  </p>
                </div>

                {/* Features */}
                <div className="flex-1 space-y-3 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-bvbp-growth mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Button 
                  variant={service.popular ? "success" : "hero"} 
                  className="w-full"
                  size="lg"
                >
                  {service.cta}
                </Button>
              </Card>
            );
          })}
        </div>

        {/* ROI Guarantee */}
        <div className="max-w-3xl mx-auto">
          <Card className="p-8 bg-bvbp-growth/10 border-bvbp-growth/20">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-success mb-4">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="font-heading text-2xl font-bold text-bvbp-corporate mb-4">
                Garantia de ROI
              </h3>
              
              <p className="text-foreground mb-6">
                <strong>Se não identificarmos pelo menos R$ 30.000 em oportunidades de economia</strong> 
                no diagnóstico gratuito, nem cobramos o projeto. É nossa garantia de que só trabalhamos 
                com empresas onde podemos gerar valor real.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-bvbp-growth mb-1">300%+</div>
                  <div className="text-sm text-muted-foreground">ROI Médio Primeiro Ano</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-bvbp-growth mb-1">60 dias</div>
                  <div className="text-sm text-muted-foreground">Primeiros Resultados</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-bvbp-growth mb-1">90 dias</div>
                  <div className="text-sm text-muted-foreground">Autonomia Completa</div>
                </div>
              </div>

              <Button variant="hero" size="xl">
                COMEÇAR COM DIAGNÓSTICO GRATUITO
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;