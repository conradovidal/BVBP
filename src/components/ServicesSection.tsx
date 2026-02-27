import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Zap, TrendingUp, Crown, Search, Settings } from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      title: "Diagnóstico Operacional",
      duration: "1 semana",
      icon: Search,
      description: "Mapeamos onde o fluxo trava, onde o retrabalho aparece e quais são os próximos passos mais efetivos.",
      features: [
        "Conversa com o líder para entender contexto e objetivo",
        "Mapeamento de 1 fluxo crítico de ponta a ponta",
        "Baseline simples, filas, retrabalho e pontos de decisão",
        "Plano de 2 semanas com prioridades e sequência sugerida"
      ],
      details: [
        "2 a 3 encontros ao longo da semana",
        "Sem necessidade de envolver toda a equipe",
        "Entrega objetiva, sem burocracia"
      ],
      cta: "Quero mapear meu gargalo"
    },
    {
      title: "Otimização de Processo",
      duration: "2 semanas",
      icon: Zap,
      description: "Escolhemos 1 fluxo e entregamos um resultado rápido e visível. Menos fila, menos retrabalho, mais clareza do que está em andamento.",
      features: [
        "Diagnóstico rápido do fluxo e seus gargalos",
        "Redesenho do processo com acordos e regras simples",
        "Ajustes no jeito de trabalhar, entrada, saída, prioridade",
        "Validação e acompanhamento da implementação"
      ],
      details: [
        "1 fluxo por sprint, sem tentar arrumar a empresa",
        "Foco em reduzir fila e retrabalho",
        "Resultado visível em pouco tempo"
      ],
      cta: "Quero destravar um fluxo"
    },
    {
      title: "Configuração de Gestão e Entrega de Projetos",
      duration: "3-4 semanas",
      icon: Settings,
      description: "Criamos o sistema mínimo para tocar projetos com cadência, papéis claros e reporting que vira decisão.",
      features: [
        "Board mínimo e padrão de organização de projetos",
        "Cadência de ritos, alinhamentos e checkpoints",
        "Definição de papéis, responsabilidades e acordos",
        "Modelo de reporte simples para dar visibilidade"
      ],
      details: [
        "Adaptado à ferramenta que vocês já usam",
        "Menos status, mais clareza e decisão",
        "Pronto para escalar com o time"
      ],
      cta: "Quero organizar meus projetos"
    },
    {
      title: "Implementação de Governança de Execução",
      duration: "Mensal",
      icon: TrendingUp,
      description: "Implementamos uma governança leve para dar ritmo, visibilidade e alinhamento sem burocracia.",
      features: [
        "Rotina de planejamento e revisão com cadências claras",
        "Padrão de priorização e tomada de decisão",
        "Métricas mínimas para acompanhar progresso e gargalos",
        "Template de comunicação e atualização de status"
      ],
      details: [
        "Baixo custo de manutenção",
        "Funciona bem em time remoto e fuso diferente",
        "Traz previsibilidade sem engessar"
      ],
      cta: "Quero governança leve"
    },
    {
      title: "Programa Customizado de Melhoria",
      duration: "6 a 12 semanas",
      icon: Crown,
      description: "Para quando precisa pensar no longo prazo. Melhoramos 2 a 3 fluxos críticos e deixamos governança mínima para sustentar.",
      features: [
        "Plano por ondas com escopo e sequência de execução",
        "Otimização de 2 a 3 fluxos críticos",
        "Implementação acompanhada para garantir adoção",
        "Capacitação do time para manter depois"
      ],
      details: [
        "Entrada via Diagnóstico Operacional",
        "Escopo controlado, sem virar infinito",
        "Foco em resultado prático e sustentação"
      ],
      cta: "Quero um plano sob medida"
    }
  ];

  const scrollToContact = () => {
    document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="servicos" className="py-16 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-4">
            Serviços
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ofertas enxutas para tirar gargalos do caminho e dar previsibilidade para a operação.
          </p>
        </div>

        {/* Services Grid */}
        <div className="space-y-8">
          {/* First row - 3 cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(0, 3).map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card 
                  key={index} 
                  className="relative p-6 h-full flex flex-col hover:shadow-strong transition-smooth"
                >
                  {/* Header */}
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 aspect-square rounded-full bg-gradient-hero mb-4">
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

                  {/* O que está incluído */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-bvbp-corporate mb-2">O que está incluído</h4>
                    <div className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-bvbp-growth mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Detalhes */}
                  <div className="flex-1 mb-6">
                    <h4 className="text-sm font-semibold text-bvbp-corporate mb-2">Detalhes</h4>
                    <div className="space-y-2">
                      {service.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-start space-x-2">
                          <span className="text-sm text-muted-foreground">• {detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <Button 
                    variant="hero" 
                    className="w-full"
                    size="lg"
                    onClick={scrollToContact}
                  >
                    {service.cta}
                  </Button>
                </Card>
              );
            })}
          </div>

          {/* Second row - 2 cards centered */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {services.slice(3, 5).map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card 
                  key={index + 3} 
                  className="relative p-6 h-full flex flex-col hover:shadow-strong transition-smooth"
                >
                  {/* Header */}
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 aspect-square rounded-full bg-gradient-hero mb-4">
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

                  {/* O que está incluído */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-bvbp-corporate mb-2">O que está incluído</h4>
                    <div className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-bvbp-growth mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Detalhes */}
                  <div className="flex-1 mb-6">
                    <h4 className="text-sm font-semibold text-bvbp-corporate mb-2">Detalhes</h4>
                    <div className="space-y-2">
                      {service.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-start space-x-2">
                          <span className="text-sm text-muted-foreground">• {detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <Button 
                    variant="hero" 
                    className="w-full"
                    size="lg"
                    onClick={scrollToContact}
                  >
                    {service.cta}
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;