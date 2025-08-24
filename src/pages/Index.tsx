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
          <section className="py-20 lg:py-32 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto text-center space-y-12">
                <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-bvbp-corporate leading-tight">
                  <span className="text-bvbp-growth">Crescimento</span> sem caos.
                </h1>
                
                <h2 className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                  Transformamos processos bagunçados em sistemas que funcionam, com resultados mensuráveis em até 90 dias.
                </h2>
                
                <div className="pt-8">
                  <Button 
                    size="xl" 
                    className="bg-bvbp-growth hover:bg-bvbp-growth-dark text-white text-lg px-10 py-5 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-bvbp-growth/25"
                    onClick={() => window.location.href = '/contato'}
                  >
                    Agendar diagnóstico gratuito
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Problem Section */}
          <section className="py-16 bg-muted">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate text-center mb-12">
                  Reconhece estes sintomas?
                </h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="flex items-start space-x-4">
                    <Target className="h-8 w-8 text-bvbp-growth mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-bvbp-corporate mb-2">CEO é o gargalo de decisões</h3>
                      <p className="text-muted-foreground">Estratégia de lado, tempo gasto apagando incêndios</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Users className="h-8 w-8 text-bvbp-growth mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-bvbp-corporate mb-2">Reuniões sem objetivo</h3>
                      <p className="text-muted-foreground">Horas perdidas em alinhamentos que não geram resultado</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <TrendingUp className="h-8 w-8 text-bvbp-growth mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-bvbp-corporate mb-2">Crescimento travado pela operação</h3>
                      <p className="text-muted-foreground">A receita sobe, a eficiência despenca</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Zap className="h-8 w-8 text-bvbp-growth mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-bvbp-corporate mb-2">Equipe desmotivada pelo retrabalho</h3>
                      <p className="text-muted-foreground">Processos mal definidos geram frustração e desperdício</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-center mt-12">
                  <p className="text-lg text-bvbp-corporate-light">
                    Se sua empresa parece ter crescido para o caos, você não está sozinho.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Differentiation Section */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate text-center mb-12">
                  Nossa forma de trabalhar é diferente
                </h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-bvbp-growth-light rounded-full flex items-center justify-center mx-auto">
                      <Target className="h-8 w-8 text-bvbp-growth" />
                    </div>
                    <h3 className="font-heading font-bold text-xl text-bvbp-corporate">Customização Real</h3>
                    <p className="text-muted-foreground">
                      Nada de receita pronta — cada solução é feita para sua realidade
                    </p>
                  </div>
                  
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-bvbp-growth-light rounded-full flex items-center justify-center mx-auto">
                      <Zap className="h-8 w-8 text-bvbp-growth" />
                    </div>
                    <h3 className="font-heading font-bold text-xl text-bvbp-corporate">Execução Lado a Lado</h3>
                    <p className="text-muted-foreground">
                      Somos parceiros de negócio, não entregadores de PowerPoint
                    </p>
                  </div>
                  
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-bvbp-growth-light rounded-full flex items-center justify-center mx-auto">
                      <TrendingUp className="h-8 w-8 text-bvbp-growth" />
                    </div>
                    <h3 className="font-heading font-bold text-xl text-bvbp-corporate">ROI Transparente</h3>
                    <p className="text-muted-foreground">
                      Mostramos onde o dinheiro escorre e quanto pode ser recuperado
                    </p>
                  </div>
                  
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-bvbp-growth-light rounded-full flex items-center justify-center mx-auto">
                      <Users className="h-8 w-8 text-bvbp-growth" />
                    </div>
                    <h3 className="font-heading font-bold text-xl text-bvbp-corporate">Autonomia em 90 dias</h3>
                    <p className="text-muted-foreground">
                      Sua equipe ganha capacidade para evoluir sem depender da gente
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Authority Section */}
          <section className="py-16 bg-bvbp-growth-light">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <blockquote className="text-2xl md:text-3xl font-medium text-bvbp-corporate italic">
                  "Vivenciamos na prática os desafios de escalar operações em empresas reais. 
                  Não é teoria, é experiência de quem já esteve dentro."
                </blockquote>
                
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-bvbp-growth" />
                    <span className="text-bvbp-corporate-light">10+ anos em operações empresariais</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-bvbp-growth" />
                    <span className="text-bvbp-corporate-light">Business Agility & Process Optimization</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-bvbp-growth" />
                    <span className="text-bvbp-corporate-light">Metodologias testadas em scale-ups de alto crescimento</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center space-y-8">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate">
                  Cada semana no caos custa caro. Comece hoje.
                </h2>
                
                <p className="text-xl text-muted-foreground">
                  Agende seu diagnóstico gratuito — clareza sem compromisso.
                </p>
                
                <Button 
                  size="xl" 
                  className="bg-bvbp-growth hover:bg-bvbp-growth-dark text-white text-lg px-8 py-4"
                  onClick={() => window.location.href = '/contato'}
                >
                  Quero meu diagnóstico gratuito
                </Button>
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
