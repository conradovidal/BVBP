import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Target, Wrench, Rocket, CheckCircle } from "lucide-react";

const SolutionSection = () => {
  const differentiators = [
    {
      icon: Search,
      title: "Diagnóstico Transparente",
      description: "Mostramos exatamente onde você está perdendo dinheiro",
      features: ["Mapeamento completo dos gaps", "Potencial de economia identificado", "Relatório executivo detalhado"]
    },
    {
      icon: Target,
      title: "Soluções Customizadas",
      description: "Não empurramos metodologia pronta - criamos específico para você",
      features: ["Análise da sua realidade específica", "Soluções sob medida", "Adaptação ao seu contexto"]
    },
    {
      icon: Wrench,
      title: "Implementação Hands-On",
      description: "Não entregamos PowerPoint - colocamos a mão na massa",
      features: ["Implementação prática", "Acompanhamento diário", "Ajustes em tempo real"]
    },
    {
      icon: Rocket,
      title: "Autonomia Garantida",
      description: "Em 90 dias você fica independente para evoluir sozinho",
      features: ["Capacitação da equipe", "Ferramentas próprias", "Independência total"]
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-bvbp-growth/10 text-bvbp-growth font-semibold text-sm mb-4">
            A DIFERENÇA BVBP
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-4">
            A BVBP É Diferente: Soluções Sob Medida
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enquanto outras consultorias empurram métodos prontos, nós criamos soluções específicas 
            para sua realidade, garantindo resultados reais e duradouros
          </p>
        </div>

        {/* Differentiators Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {differentiators.map((diff, index) => {
            const IconComponent = diff.icon;
            return (
              <Card key={index} className="p-6 h-full hover:shadow-soft transition-smooth border-t-4 border-t-bvbp-corporate">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-hero mb-4">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-bvbp-corporate mb-2">
                    {diff.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {diff.description}
                  </p>
                </div>
                
                <div className="space-y-2">
                  {diff.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-bvbp-growth mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Comparison Section */}
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden">
            <div className="grid md:grid-cols-2">
              {/* Traditional Consulting */}
              <div className="p-8 bg-red-50 border-r border-red-200">
                <h3 className="font-heading text-xl font-bold text-red-700 mb-4 text-center">
                  Consultorias Tradicionais
                </h3>
                <div className="space-y-3">
                  {[
                    "Metodologias 'receita de bolo'",
                    "Soluções genéricas",
                    "Relatórios em PowerPoint",
                    "Dependência permanente",
                    "Resultados questionáveis"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-foreground text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* BVBP Approach */}
              <div className="p-8 bg-bvbp-growth/10">
                <h3 className="font-heading text-xl font-bold text-bvbp-corporate mb-4 text-center">
                  Abordagem BVBP
                </h3>
                <div className="space-y-3">
                  {[
                    "Soluções 100% customizadas",
                    "Específico para sua realidade",
                    "Implementação hands-on",
                    "Autonomia em 90 dias",
                    "ROI comprovado e mensurável"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-bvbp-growth" />
                      <span className="text-foreground text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <h3 className="font-heading text-2xl font-bold text-bvbp-corporate mb-4">
            Pronto Para Uma Abordagem Diferente?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Comece com nosso diagnóstico gratuito e descubra exatamente onde sua empresa 
            está perdendo dinheiro - sem compromisso, sem "receitas prontas"
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl">
              QUERO MEU DIAGNÓSTICO GRATUITO
            </Button>
            <Button variant="outline-hero" size="xl">
              Falar com Especialista
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;