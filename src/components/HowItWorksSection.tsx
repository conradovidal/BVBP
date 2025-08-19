import { Card } from "@/components/ui/card";
import { Search, PenTool, Cog, Trophy, ArrowRight } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: Search,
      title: "Diagnóstico Profundo",
      subtitle: "SEMANA 1-2",
      description: "Mapeamos todos os processos, identificamos gargalos e calculamos o potencial de economia específico para sua empresa",
      features: ["Análise de processos atuais", "Identificação de gargalos", "Cálculo de potencial ROI"]
    },
    {
      icon: PenTool,
      title: "Redesenho Customizado",
      subtitle: "SEMANA 3-4", 
      description: "Criamos soluções específicas para sua realidade, sem receitas prontas. Cada processo é redesenhado pensando no seu contexto",
      features: ["Soluções sob medida", "Processos otimizados", "Plano de implementação"]
    },
    {
      icon: Cog,
      title: "Implementação Hands-On",
      subtitle: "SEMANA 5-8",
      description: "Colocamos a mão na massa junto com sua equipe. Implementamos, ajustamos e garantimos que tudo funcione na prática",
      features: ["Implementação prática", "Treinamento da equipe", "Ajustes em tempo real"]
    },
    {
      icon: Trophy,
      title: "Autonomia Completa",
      subtitle: "90 DIAS",
      description: "Sua equipe está capacitada e autônoma. Você não depende mais de nós para evoluir e otimizar seus processos",
      features: ["Equipe capacitada", "Processos documentados", "Independência total"]
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-4">
            Como Funciona (Simples e Transparente)
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Nossa metodologia comprovada em 4 etapas que leva sua empresa do caos operacional 
            à autonomia completa em apenas 90 dias
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-6xl mx-auto">
          {/* Desktop Timeline Line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-bvbp-corporate via-bvbp-growth to-bvbp-corporate"></div>
          
          <div className="grid lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="relative">
                  {/* Mobile Arrow */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden flex justify-center mt-8 mb-4">
                      <ArrowRight className="h-6 w-6 text-bvbp-growth" />
                    </div>
                  )}
                  
                  <Card className="relative p-6 h-full hover:shadow-soft transition-smooth">
                    {/* Step Number */}
                    <div className="absolute -top-4 left-6 w-8 h-8 rounded-full bg-gradient-hero text-white flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    
                    {/* Desktop Timeline Dot */}
                    <div className="hidden lg:block absolute -top-16 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-success border-4 border-white shadow-soft"></div>
                    
                    <div className="pt-4">
                      {/* Icon */}
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-subtle mb-4">
                        <IconComponent className="h-6 w-6 text-bvbp-corporate" />
                      </div>
                      
                      {/* Content */}
                      <div className="mb-4">
                        <div className="text-sm font-semibold text-bvbp-growth mb-1">
                          {step.subtitle}
                        </div>
                        <h3 className="font-heading text-xl font-bold text-bvbp-corporate mb-2">
                          {step.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                      
                      {/* Features */}
                      <div className="space-y-2">
                        {step.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-bvbp-growth"></div>
                            <span className="text-sm text-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Results Promise */}
        <div className="max-w-4xl mx-auto mt-16">
          <Card className="p-8 md:p-12 bg-gradient-subtle border-0">
            <div className="text-center">
              <h3 className="font-heading text-2xl md:text-3xl font-bold text-bvbp-corporate mb-6">
                O Que Você Pode Esperar
              </h3>
              
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-bvbp-growth mb-2">30 dias</div>
                  <div className="font-semibold text-bvbp-corporate mb-2">Primeiros Quick Wins</div>
                  <div className="text-sm text-muted-foreground">Melhorias imediatas visíveis</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-bvbp-growth mb-2">60 dias</div>
                  <div className="font-semibold text-bvbp-corporate mb-2">Resultados Mensuráveis</div>
                  <div className="text-sm text-muted-foreground">ROI transparente e comprovado</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-bvbp-growth mb-2">90 dias</div>
                  <div className="font-semibold text-bvbp-corporate mb-2">Autonomia Completa</div>
                  <div className="text-sm text-muted-foreground">Independência para evoluir sozinho</div>
                </div>
              </div>
              
              <p className="text-muted-foreground text-lg mb-6">
                Não criamos dependência. Nosso objetivo é tornar sua equipe autônoma 
                para continuar otimizando processos sem nossa ajuda.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;