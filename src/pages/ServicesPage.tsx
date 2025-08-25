import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, DollarSign, ArrowRight, Zap, TrendingUp, Star, Crown, Search, Target, Wrench, Rocket } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const ServicesPage = () => {
  const processSteps = [
    {
      number: "01",
      title: "Diagnóstico",
      description: "Mapeamento completo dos seus processos atuais, identificação de gargalos e quantificação de perdas",
      icon: Search,
      duration: "2 semanas"
    },
    {
      number: "02", 
      title: "Redesenho",
      description: "Criação de soluções customizadas específicas para sua realidade, sem metodologias genéricas",
      icon: Target,
      duration: "1-2 semanas"
    },
    {
      number: "03",
      title: "Implementação", 
      description: "Colocamos a mão na massa junto com sua equipe, garantindo que as mudanças aconteçam de verdade",
      icon: Wrench,
      duration: "2-6 semanas"
    },
    {
      number: "04",
      title: "Capacitação",
      description: "Treinamos sua equipe para evoluir de forma autônoma, sem dependência permanente",
      icon: Rocket,
      duration: "Contínuo"
    }
  ];

  const services = [
    {
      title: "TRANSPARÊNCIA",
      badge: "GRATUITO",
      badgeColor: "bg-bvbp-growth text-white",
      duration: "2 semanas",
      icon: Zap,
      description: "Diagnóstico inicial gratuito para entender como um processo funciona hoje e onde estão as perdas. Sem pegadinhas, sem compromisso.",
      features: [
        "Entrevistas com liderança e equipe-chave",
        "Mapeamento completo de um processo crítico", 
        "Relatório executivo com gaps e oportunidades de economia"
      ],
      details: [
        "2 semanas de análise intensiva",
        "Relatório executivo de 15-20 páginas",
        "Apresentação dos resultados",
        "Sem compromisso de continuidade"
      ],
      cta: "Começar com Transparência",
      popular: false
    },
    {
      title: "VISÃO DE FUTURO",
      badge: "ESSENCIAL", 
      badgeColor: "bg-blue-500 text-white",
      duration: "4 semanas",
      icon: Target,
      description: "Redesenho de um processo crítico e definição de como ele deve funcionar no futuro. Clareza sobre ganhos e roadmap de melhorias.",
      features: [
        "Redesenho de um processo crítico",
        "Definição do estado futuro",
        "Clareza sobre ganhos e roadmap",
        "Métrica base para acompanhamento"
      ],
      details: [
        "Foco no processo que gera maior impacto",
        "Implementação hands-on junto com equipe",
        "Resultados visíveis em 30 dias",
        "Base para expansão futura"
      ],
      cta: "Desenhar minha Visão de Futuro",
      popular: false
    },
    {
      title: "IMPLEMENTAÇÃO PRÁTICA",
      badge: "RECOMENDADO",
      badgeColor: "bg-orange-500 text-white", 
      duration: "8 semanas",
      icon: Wrench,
      description: "Execução lado a lado para implementar mudanças em um processo, garantindo métricas claras e resultados visíveis em semanas.",
      features: [
        "Execução lado a lado com a equipe",
        "Implementação das mudanças na prática",
        "Métricas e acompanhamento contínuo",
        "Capacitação durante o processo"
      ],
      details: [
        "Visão sistêmica da operação",
        "ROI transparente e mensurável",
        "Controle contínuo estabelecido",
        "Equipe preparada para evolução"
      ],
      cta: "Avançar com Implementação Prática",
      popular: true
    },
    {
      title: "AUTOMAÇÃO INTELIGENTE",
      badge: "PREMIUM",
      badgeColor: "bg-purple-500 text-white",
      duration: "10 semanas",
      icon: Star,
      description: "Introdução de automações e integração tecnológica em um processo, com dashboards e ganhos de eficiência comprovados.",
      features: [
        "Automações simples implementadas",
        "Integração entre sistemas",
        "Dashboards de acompanhamento",
        "Otimização tecnológica"
      ],
      details: [
        "Foco em automações práticas",
        "Redução de trabalho manual",
        "Melhor visibilidade de dados",
        "ROI por redução de retrabalho"
      ],
      cta: "Aplicar Automação Inteligente",
      popular: false
    },
    {
      title: "MELHORIA CONTÍNUA",
      badge: "PARTNER",
      badgeColor: "bg-gradient-hero text-white",
      duration: "12 semanas",
      icon: Crown,
      description: "Acompanhamento recorrente, ajustes e evolução estratégica de processos ao longo do tempo. Sustentabilidade e crescimento de longo prazo.",
      features: [
        "Acompanhamento recorrente mensal",
        "Ajustes e evolução de processos",
        "Garantia de sustentabilidade",
        "Autonomia total da equipe"
      ],
      details: [
        "Transformação completa da operação",
        "Sustentabilidade e crescimento",
        "Autonomia total garantida",
        "Crescimento sustentável assegurado"
      ],
      cta: "Investir em Melhoria Contínua",
      popular: false
    }
  ];

  const specificSolutions = [
    {
      title: "Radiografia de Eficiência",
      description: "Em uma semana, levantamos dados de retrabalho e desperdícios em um processo específico. Números claros sobre perdas e oportunidades.",
      icon: Search
    },
    {
      title: "Governança de Reuniões",
      description: "Auditoria da agenda de liderança. Reestruturamos rituais para reduzir reuniões improdutivas e liberar tempo estratégico.",
      icon: Clock
    },
    {
      title: "Planejamento com Clareza",
      description: "Transformamos metas em planos acionáveis para uma área. Clareza sobre prioridades e alinhamento sem travar a operação.",
      icon: Target
    },
    {
      title: "Otimização de Fluxo de Valor",
      description: "Mapeamos ponta a ponta um processo crítico para eliminar desperdícios que custam até 30% da eficiência.",
      icon: TrendingUp
    }
  ];

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Nossos Serviços - BVBP | Transformação de Processos para SMBs</title>
        <meta name="description" content="Conheça os serviços BVBP: do diagnóstico gratuito à transformação completa. Soluções customizadas para otimizar processos e garantir crescimento sustentável." />
      </Helmet>
      
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-16 lg:py-24 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-bvbp-corporate mb-6">
                Nossos Serviços
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Jornada modular de transformação.<br />
                Do diagnóstico gratuito ao acompanhamento contínuo.<br />
                Escolha o nível ideal para sua empresa.
              </p>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-4">
                Nossos Serviços
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Cada serviço é prático, mensurável e voltado para dar autonomia à sua equipe.
              </p>
            </div>

            <div className="space-y-8 max-w-7xl mx-auto">
              {/* First row - 3 cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.slice(0, 3).map((service, index) => {
                  const IconComponent = service.icon;
                  return (
                    <Card 
                      key={index} 
                      className={`relative p-8 h-full flex flex-col hover:shadow-strong transition-smooth ${
                        service.popular ? 'ring-2 ring-bvbp-growth' : ''
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
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                          service.popular ? 'bg-gradient-success' : 'bg-gradient-hero'
                        }`}>
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        
                        <h3 className="font-heading text-2xl font-bold text-bvbp-corporate mb-2">
                          {service.title}
                        </h3>
                        
                        <div className="flex items-center justify-center mb-4">
                          <div className="text-sm text-muted-foreground">
                            <Clock className="h-4 w-4 inline mr-1" />
                            {service.duration}
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground">
                          {service.description}
                        </p>
                      </div>

                      {/* Features */}
                      <div className="space-y-3 mb-6 flex-1">
                        <h4 className="font-semibold text-bvbp-corporate">O que está incluído:</h4>
                        {service.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-bvbp-growth mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Details */}
                      <div className="bg-muted/30 p-4 rounded-lg mb-6">
                        <h4 className="font-semibold text-bvbp-corporate mb-2">Detalhes:</h4>
                        <div className="space-y-1">
                          {service.details.map((detail, detailIndex) => (
                            <div key={detailIndex} className="text-sm text-muted-foreground">
                              • {detail}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CTA */}
                      <Button 
                        variant={service.popular ? "success" : "hero"} 
                        className="w-full px-4 py-2 text-center"
                        size="lg"
                        onClick={() => window.location.href = '/contato'}
                      >
                        {service.cta}
                      </Button>
                    </Card>
                  );
                })}
              </div>

              {/* Second row - 2 cards */}
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {services.slice(3, 5).map((service, index) => {
                  const IconComponent = service.icon;
                  return (
                    <Card 
                      key={index + 3} 
                      className={`relative p-8 h-full flex flex-col hover:shadow-strong transition-smooth ${
                        service.popular ? 'ring-2 ring-bvbp-growth' : ''
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
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                          service.popular ? 'bg-gradient-success' : 'bg-gradient-hero'
                        }`}>
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        
                        <h3 className="font-heading text-2xl font-bold text-bvbp-corporate mb-2">
                          {service.title}
                        </h3>
                        
                        <div className="flex items-center justify-center mb-4">
                          <div className="text-sm text-muted-foreground">
                            <Clock className="h-4 w-4 inline mr-1" />
                            {service.duration}
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground">
                          {service.description}
                        </p>
                      </div>

                      {/* Features */}
                      <div className="space-y-3 mb-6 flex-1">
                        <h4 className="font-semibold text-bvbp-corporate">O que está incluído:</h4>
                        {service.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-bvbp-growth mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Details */}
                      <div className="bg-muted/30 p-4 rounded-lg mb-6">
                        <h4 className="font-semibold text-bvbp-corporate mb-2">Detalhes:</h4>
                        <div className="space-y-1">
                          {service.details.map((detail, detailIndex) => (
                            <div key={detailIndex} className="text-sm text-muted-foreground">
                              • {detail}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CTA */}
                      <Button 
                        variant={service.popular ? "success" : "hero"} 
                        className="w-full px-4 py-2 text-center"
                        size="lg"
                        onClick={() => window.location.href = '/contato'}
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

        {/* Specific Solutions Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-4">
                Soluções específicas para dores imediatas
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Diagnósticos e intervenções pontuais para resultados rápidos
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {specificSolutions.map((solution, index) => {
                const IconComponent = solution.icon;
                return (
                  <Card key={index} className="p-6 hover:shadow-soft transition-smooth">
                    <div className="flex items-start space-x-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-hero flex-shrink-0">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-heading text-xl font-bold text-bvbp-corporate mb-3">
                          {solution.title}
                        </h3>
                        
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {solution.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Guarantee Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="p-8 md:p-12 bg-bvbp-growth/10 border-bvbp-growth/20">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-success mb-6">
                    <DollarSign className="h-10 w-10 text-white" />
                  </div>
                  
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-6">
                    Nossa Garantia
                  </h2>
                  
                  <div className="prose prose-lg max-w-none mb-8">
                    <p className="text-foreground leading-relaxed">
                      <strong>Se não identificarmos pelo menos R$ 30.000 em oportunidades de economia</strong> 
                      no diagnóstico gratuito, você não paga nada.
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-bvbp-growth mb-2">R$ 30.000+</div>
                      <div className="text-sm text-muted-foreground">Oportunidades mapeadas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-bvbp-growth mb-2">60 dias</div>
                      <div className="text-sm text-muted-foreground">Primeiros resultados</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-bvbp-growth mb-2">90 dias</div>
                      <div className="text-sm text-muted-foreground">Autonomia inicial</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-heading text-xl font-bold text-bvbp-corporate">
                      Pronto para Descobrir Suas Oportunidades?
                    </h3>
                    <p className="text-muted-foreground">
                      Comece com nosso diagnóstico gratuito - sem compromisso, só clareza
                    </p>
                    <Button 
                      variant="hero" 
                      size="xl" 
                      className="group"
                      onClick={() => window.location.href = '/contato'}
                    >
                      Comece com Transparência
                      <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ServicesPage;