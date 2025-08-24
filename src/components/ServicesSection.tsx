import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, DollarSign, Star, Zap, TrendingUp, Crown } from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      title: "TRANSPARÊNCIA",
      badge: "GRATUITO",
      badgeColor: "bg-bvbp-growth text-white",
      duration: "2 semanas",
      icon: Zap,
      description: "Diagnóstico inicial sem custos",
      features: [
        "Entrevistas com liderança e equipe-chave",
        "Mapeamento completo dos processos críticos",
        "Relatório executivo com gaps e oportunidades"
      ],
      cta: "Quero começar com Transparência",
      popular: false
    },
    {
      title: "VISÃO DE FUTURO",
      badge: "ESSENCIAL",
      badgeColor: "bg-blue-500 text-white",
      duration: "4 semanas",
      icon: TrendingUp,
      description: "Redesenho de processos críticos e definição do estado futuro",
      features: [
        "Redesenho de processos críticos",
        "Definição do estado futuro",
        "Clareza sobre ganhos e roadmap"
      ],
      cta: "Quero desenhar minha Visão de Futuro",
      popular: false
    },
    {
      title: "IMPLEMENTAÇÃO PRÁTICA",
      badge: "RECOMENDADO",
      badgeColor: "bg-orange-500 text-white",
      duration: "8 semanas",
      icon: Star,
      description: "Execução lado a lado, implementação das mudanças",
      features: [
        "Execução lado a lado com a equipe",
        "Implementação das mudanças na prática",
        "Métricas e acompanhamento contínuo"
      ],
      cta: "Quero avançar com Implementação Prática",
      popular: true
    },
    {
      title: "MELHORIA CONTÍNUA",
      badge: "PREMIUM",
      badgeColor: "bg-gradient-hero text-white",
      duration: "12 semanas",
      icon: Crown,
      description: "Acompanhamento recorrente e garantia de sustentabilidade",
      features: [
        "Acompanhamento recorrente mensal",
        "Ajustes e evolução de processos",
        "Garantia de sustentabilidade"
      ],
      cta: "Quero investir em Melhoria Contínua",
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
                  
                  <div className="text-sm text-muted-foreground mb-2">
                    <Clock className="h-4 w-4 inline mr-1" />
                    {service.duration}
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
                  onClick={() => window.location.href = '/contato'}
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

              <Button variant="hero" size="xl" onClick={() => window.location.href = '/contato'}>
                COMEÇAR COM DIAGNÓSTICO GRATUITO
              </Button>
            </div>
          </Card>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            * Estimativas indicativas. Confirmadas no diagnóstico e variam por setor, porte e maturidade de processos.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;