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
      title: "DIAGNÓSTICO GRATUITO",
      badge: "GRÁTIS",
      badgeColor: "bg-bvbp-growth text-white",
      price: "R$ 0",
      duration: "2 semanas",
      icon: Zap,
      description: "Descubra exatamente onde sua empresa está perdendo dinheiro",
      features: [
        "Entrevistas com liderança e equipe-chave",
        "Mapeamento completo dos processos críticos", 
        "Relatório executivo detalhado com gaps identificados",
        "Potencial de economia quantificado",
        "Roadmap personalizado de melhorias",
        "Análise de ROI potencial por iniciativa"
      ],
      details: [
        "2 semanas de análise intensiva",
        "Relatório executivo de 15-20 páginas",
        "Apresentação dos resultados",
        "Sem compromisso de continuidade"
      ],
      cta: "AGENDAR DIAGNÓSTICO",
      popular: false
    },
    {
      title: "QUICK WIN",
      badge: "MAIS POPULAR", 
      badgeColor: "bg-orange-500 text-white",
      price: "R$ 6.500",
      duration: "4 semanas",
      icon: TrendingUp,
      description: "Primeiros resultados mensuráveis no processo mais crítico",
      features: [
        "Diagnóstico completo incluído",
        "1 processo crítico completamente redesenhado",
        "Quick wins imediatos implementados",
        "Métricas e KPIs definidos",
        "Treinamento prático da equipe",
        "30 dias de suporte pós-implementação"
      ],
      details: [
        "Foco no processo que gera maior impacto",
        "Implementação hands-on junto com equipe",
        "Resultados visíveis em 30 dias",
        "Base para expansão futura"
      ],
      cta: "COMEÇAR QUICK WIN",
      popular: true
    },
    {
      title: "MOMENTUM",
      badge: "RECOMENDADO",
      badgeColor: "bg-bvbp-corporate text-white", 
      price: "R$ 12.500",
      duration: "8 semanas",
      icon: Star,
      description: "Transformação sistêmica com métricas e controle contínuo",
      features: [
        "3-5 processos críticos otimizados",
        "Sistema de métricas implementado",
        "Automações simples onde aplicável",
        "Dashboard de acompanhamento",
        "Capacitação completa da equipe",
        "60 dias de suporte incluído"
      ],
      details: [
        "Visão sistêmica da operação",
        "ROI transparente e mensurável",
        "Controle contínuo estabelecido",
        "Equipe preparada para evolução"
      ],
      cta: "QUERO MOMENTUM",
      popular: false
    },
    {
      title: "TRANSFORMATION",
      badge: "PREMIUM",
      badgeColor: "bg-gradient-hero text-white",
      price: "R$ 22.000", 
      duration: "12 semanas",
      icon: Crown,
      description: "Mudança sistêmica completa com autonomia garantida",
      features: [
        "Operação completa redesenhada",
        "Todos os processos críticos otimizados",
        "Sistema completo de métricas e controle",
        "Capacitação extensiva de toda equipe",
        "Documentação completa de processos",
        "6 meses de suporte incluído"
      ],
      details: [
        "Transformação completa da operação",
        "ROI médio de 300%+ no primeiro ano",
        "Autonomia total garantida",
        "Crescimento sustentável assegurado"
      ],
      cta: "TRANSFORMAR AGORA",
      popular: false
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
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                Jornada modular de transformação: do diagnóstico gratuito à mudança sistêmica completa. 
                Escolha o nível ideal para sua empresa.
              </p>
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-bvbp-growth/10 text-bvbp-growth font-semibold">
                <DollarSign className="h-5 w-5 mr-2" />
                ROI garantido em todos os serviços
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-4">
                Como Trabalhamos
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Nossa metodologia prática em 4 etapas para garantir resultados reais e duradouros
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {processSteps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <Card key={index} className="p-6 text-center hover:shadow-soft transition-smooth relative">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="w-8 h-8 rounded-full bg-bvbp-growth text-white flex items-center justify-center font-bold text-sm">
                        {step.number}
                      </div>
                    </div>
                    
                    <div className="pt-6">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-hero mb-4">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      
                      <h3 className="font-heading text-xl font-bold text-bvbp-corporate mb-2">
                        {step.title}
                      </h3>
                      
                      <div className="text-sm text-bvbp-growth font-semibold mb-3">
                        <Clock className="h-4 w-4 inline mr-1" />
                        {step.duration}
                      </div>
                      
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    {/* Arrow for desktop */}
                    {index < processSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                        <ArrowRight className="h-6 w-6 text-bvbp-growth" />
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-4">
                Serviços Detalhados
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Todos os serviços incluem implementação prática e capacitação para autonomia
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {services.map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <Card 
                    key={index} 
                    className={`relative p-8 hover:shadow-strong transition-smooth ${
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
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                        service.popular ? 'bg-gradient-success' : 'bg-gradient-hero'
                      }`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      
                      <h3 className="font-heading text-2xl font-bold text-bvbp-corporate mb-2">
                        {service.title}
                      </h3>
                      
                      <div className="flex items-center justify-center space-x-4 mb-4">
                        <span className={`text-3xl font-bold ${
                          service.price === "R$ 0" ? 'text-bvbp-growth' : 'text-bvbp-corporate'
                        }`}>
                          {service.price}
                        </span>
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
                    <div className="space-y-3 mb-6">
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
                      className="w-full"
                      size="lg"
                    >
                      {service.cta}
                    </Button>
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
                      no diagnóstico gratuito, nem cobramos o projeto. É nossa garantia de que só trabalhamos 
                      com empresas onde podemos gerar valor real e mensurável.
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-bvbp-growth mb-2">300%+</div>
                      <div className="text-sm text-muted-foreground">ROI Médio Primeiro Ano</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-bvbp-growth mb-2">60 dias</div>
                      <div className="text-sm text-muted-foreground">Primeiros Resultados</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-bvbp-growth mb-2">90 dias</div>
                      <div className="text-sm text-muted-foreground">Autonomia Completa</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-heading text-xl font-bold text-bvbp-corporate">
                      Pronto para Descobrir Suas Oportunidades?
                    </h3>
                    <p className="text-muted-foreground">
                      Comece com nosso diagnóstico gratuito - sem compromisso, só clareza
                    </p>
                    <Button variant="hero" size="xl" className="group">
                      COMEÇAR COM DIAGNÓSTICO GRATUITO
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