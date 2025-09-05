import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { CheckCircle, Target, Users, Zap, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>BVBP - Parceiros de negócio que transformam operações lado a lado com você</title>
        <meta name="description" content="Parceria boutique para SMBs. Diagnóstico gratuito, soluções sob medida e resultados mensuráveis em até 90 dias." />
      </Helmet>
      
      <div className="min-h-screen">
        <Header />
        <main>
          {/* Hero Section */}
          <section className="relative py-20 lg:py-32 bg-gradient-hero overflow-hidden">
            <div className="absolute inset-0 bg-black/5"></div>
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-5xl mx-auto text-center space-y-12">
                <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight animate-fade-in">
                  <span className="text-bvbp-growth-light">Crescimento</span> sem caos.
                </h1>
                
                <h2 className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed animate-fade-in [animation-delay:200ms]">
                  Transformamos processos bagunçados em sistemas que funcionam, com resultados mensuráveis em até 90 dias.
                </h2>
                
                <div className="pt-8 animate-fade-in [animation-delay:400ms]">
                  <Button 
                    variant="hero"
                    size="xl" 
                    className="group shadow-strong"
                    onClick={() => window.location.href = '/contato'}
                  >
                    Agendar diagnóstico gratuito
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Problem Section */}
          <section className="py-20 bg-gradient-subtle relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-warning"></div>
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-warning mb-8 shadow-warning">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="font-heading text-3xl md:text-5xl font-bold text-bvbp-corporate mb-6">
                    Reconhece estes sintomas?
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Identificamos os problemas mais comuns em empresas em crescimento
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="group p-6 bg-white rounded-lg hover:shadow-strong transition-all duration-500 hover:-translate-y-2 border-0">
                    <div className="flex items-start space-x-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-warning group-hover:scale-110 transition-transform duration-300 shadow-soft">
                        <Target className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-xl text-bvbp-corporate mb-3 group-hover:text-bvbp-growth transition-colors duration-300">
                          Gargalo nas decisões da alta liderança
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Estratégia de lado, tempo gasto apagando incêndios
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group p-6 bg-white rounded-lg hover:shadow-strong transition-all duration-500 hover:-translate-y-2 border-0">
                    <div className="flex items-start space-x-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-warning group-hover:scale-110 transition-transform duration-300 shadow-soft">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-xl text-bvbp-corporate mb-3 group-hover:text-bvbp-growth transition-colors duration-300">
                          Reuniões sem objetivo
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Horas perdidas em alinhamentos que não geram resultado
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group p-6 bg-white rounded-lg hover:shadow-strong transition-all duration-500 hover:-translate-y-2 border-0">
                    <div className="flex items-start space-x-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-warning group-hover:scale-110 transition-transform duration-300 shadow-soft">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-xl text-bvbp-corporate mb-3 group-hover:text-bvbp-growth transition-colors duration-300">
                          Crescimento travado pela operação
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          A receita sobe, a eficiência despenca
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group p-6 bg-white rounded-lg hover:shadow-strong transition-all duration-500 hover:-translate-y-2 border-0">
                    <div className="flex items-start space-x-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-warning group-hover:scale-110 transition-transform duration-300 shadow-soft">
                        <Zap className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-xl text-bvbp-corporate mb-3 group-hover:text-bvbp-growth transition-colors duration-300">
                          Equipe desmotivada pelo retrabalho
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Processos mal definidos geram frustração e desperdício
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center mt-16">
                  <div className="p-6 bg-bvbp-growth rounded-xl">
                    <p className="text-xl text-white font-semibold leading-relaxed">
                      Se sua empresa parece ter crescido para o caos, você não está sozinho.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Differentiation Section */}
          <section className="py-20 bg-white relative">
            <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-success"></div>
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-success mb-8 shadow-success">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="font-heading text-3xl md:text-5xl font-bold text-bvbp-corporate mb-6">
                    Nossa forma de trabalhar é diferente
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Resultados práticos através de metodologias comprovadas
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div className="group text-center p-8 hover:shadow-strong transition-all duration-500 hover:-translate-y-2 border-0 bg-gradient-subtle relative overflow-hidden rounded-lg">
                    <div className="absolute inset-0 bg-gradient-success opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className="w-20 h-20 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-soft">
                        <Target className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="font-heading font-bold text-xl text-bvbp-corporate mb-4 group-hover:text-bvbp-growth transition-colors duration-300">
                        Customização Real
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Nada de receita pronta — cada solução é feita para sua realidade. Usamos técnicas testadas, mas adaptamos ao seu contexto.
                      </p>
                    </div>
                  </div>
                  
                  <div className="group text-center p-8 hover:shadow-strong transition-all duration-500 hover:-translate-y-2 border-0 bg-gradient-subtle relative overflow-hidden rounded-lg">
                    <div className="absolute inset-0 bg-gradient-success opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className="w-20 h-20 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-soft">
                        <Zap className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="font-heading font-bold text-xl text-bvbp-corporate mb-4 group-hover:text-bvbp-growth transition-colors duration-300">
                        Execução Lado a Lado
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Não entregamos apenas relatórios. Atuamos junto com sua equipe, implementando mudanças na prática.
                      </p>
                    </div>
                  </div>
                  
                  <div className="group text-center p-8 hover:shadow-strong transition-all duration-500 hover:-translate-y-2 border-0 bg-gradient-subtle relative overflow-hidden rounded-lg">
                    <div className="absolute inset-0 bg-gradient-success opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className="w-20 h-20 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-soft">
                        <TrendingUp className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="font-heading font-bold text-xl text-bvbp-corporate mb-4 group-hover:text-bvbp-growth transition-colors duration-300">
                        ROI Transparente
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Mostramos onde estão as ineficiências e como resolvê-las. Todas as iniciativas têm métricas claras.
                      </p>
                    </div>
                  </div>
                  
                  <div className="group text-center p-8 hover:shadow-strong transition-all duration-500 hover:-translate-y-2 border-0 bg-gradient-subtle relative overflow-hidden rounded-lg">
                    <div className="absolute inset-0 bg-gradient-success opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className="w-20 h-20 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-soft">
                        <Users className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="font-heading font-bold text-xl text-bvbp-corporate mb-4 group-hover:text-bvbp-growth transition-colors duration-300">
                        Autonomia em 90 dias
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Em até 90 dias, você ganha melhorias sustentáveis prontas para a melhoria contínua.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Authority Section */}
          <section className="py-20 bg-gradient-subtle relative">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white/95 backdrop-blur-sm p-10 md:p-16 rounded-xl shadow-strong border-0">
                  <div className="text-center space-y-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-hero mb-6 shadow-soft">
                      <CheckCircle className="h-8 w-8 text-white" />
                    </div>
                    <blockquote className="text-2xl md:text-3xl font-medium text-bvbp-corporate italic leading-relaxed">
                      "Vivenciamos na prática os desafios de escalar operações em empresas reais. 
                      Não é teoria, é experiência de quem já esteve dentro."
                    </blockquote>
                    
                    <div className="grid md:grid-cols-2 gap-6 pt-8">
                      <div className="group p-4 rounded-lg hover:bg-gradient-subtle transition-all duration-300">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-6 w-6 text-bvbp-growth group-hover:scale-110 transition-transform duration-300" />
                          <span className="text-bvbp-corporate font-semibold">15+ anos em operações empresariais</span>
                        </div>
                      </div>
                      <div className="group p-4 rounded-lg hover:bg-gradient-subtle transition-all duration-300">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-6 w-6 text-bvbp-growth group-hover:scale-110 transition-transform duration-300" />
                          <span className="text-bvbp-corporate font-semibold">Processos • Planejamento • Gestão</span>
                        </div>
                      </div>
                      <div className="group p-4 rounded-lg hover:bg-gradient-subtle transition-all duration-300">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-6 w-6 text-bvbp-growth group-hover:scale-110 transition-transform duration-300" />
                          <span className="text-bvbp-corporate font-semibold">Metodologias ágeis • Lean • OKRs</span>
                        </div>
                      </div>
                      <div className="group p-4 rounded-lg hover:bg-gradient-subtle transition-all duration-300">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-6 w-6 text-bvbp-growth group-hover:scale-110 transition-transform duration-300" />
                          <span className="text-bvbp-corporate font-semibold">Gestão de Mudanças • Business Agility</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="relative py-20 bg-gradient-hero overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white/95 backdrop-blur-sm p-10 md:p-16 rounded-xl shadow-strong border-0">
                  <div className="text-center space-y-8">
                    <h2 className="font-heading text-3xl md:text-5xl font-bold text-bvbp-corporate">
                      Cada semana no caos custa caro. Comece hoje.
                    </h2>
                    
                    <p className="text-xl text-muted-foreground leading-relaxed">
                      Agende seu diagnóstico gratuito — clareza sem compromisso.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-6">
                      <Button 
                        variant="hero"
                        size="xl" 
                        className="group shadow-strong"
                        onClick={() => window.location.href = '/contato'}
                      >
                        Quero Meu Diagnóstico Gratuito
                      </Button>
                      
                      <Button 
                        variant="outline-hero"
                        size="xl" 
                        className="hover:scale-105 transition-transform shadow-soft"
                        onClick={() => window.location.href = '/sobre'}
                      >
                        Conheça mais sobre nós
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
