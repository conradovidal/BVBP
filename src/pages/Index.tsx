import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { CheckCircle, Target, Users, Zap, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
const Index = () => {
  return <>
      <Helmet>
        <title>BVBP - Parceiros de negócio que transformam operações lado a lado com você</title>
        <meta name="description" content="Parceria boutique para SMBs. Diagnóstico gratuito, soluções sob medida e resultados mensuráveis em até 90 dias." />
      </Helmet>
      
      <div className="min-h-screen">
        <Header />
        <main>
          {/* Hero Section */}
          <section className="py-16 lg:py-24 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center space-y-8">
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-bvbp-corporate leading-tight">
                  Crescer sem caos é possível.
                </h1>
                
                <h2 className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">Transformamos processos bagunçados em sistemas que funcionam, com resultados claros em até 90 dias.</h2>
                
                <div className="pt-4">
                  <Button size="xl" className="bg-bvbp-growth hover:bg-bvbp-growth-dark text-white text-lg px-8 py-4" onClick={() => window.location.href = '/contato'}>
                    Agendar Diagnóstico Gratuito
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
                  Reconhece Estes Sintomas?
                </h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="flex items-start space-x-4">
                    <Target className="h-8 w-8 text-bvbp-growth mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-bvbp-corporate mb-2">CEO apagando incêndios 70% do tempo</h3>
                      <p className="text-muted-foreground">Sem tempo para estratégia, sempre resolvendo problemas operacionais</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Users className="h-8 w-8 text-bvbp-growth mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-bvbp-corporate mb-2">40% das reuniões sem objetivo claro</h3>
                      <p className="text-muted-foreground">Tempo perdido em alinhamentos que não geram resultados</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <TrendingUp className="h-8 w-8 text-bvbp-growth mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-bvbp-corporate mb-2">Crescimento travado pela operação</h3>
                      <p className="text-muted-foreground">Faturamento cresce mas eficiência diminui</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Zap className="h-8 w-8 text-bvbp-growth mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-bvbp-corporate mb-2">Equipe desmotivada com retrabalho constante</h3>
                      <p className="text-muted-foreground">Processos mal definidos gerando frustração e ineficiência</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-center mt-12">
                  <p className="text-lg text-bvbp-corporate-light">
                    Se sua empresa cresceu mas virou um caos operacional, você não está sozinho.
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
                  Nossa Forma de Trabalhar É Diferente
                </h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-bvbp-growth-light rounded-full flex items-center justify-center mx-auto">
                      <Target className="h-8 w-8 text-bvbp-growth" />
                    </div>
                    <h3 className="font-heading font-bold text-xl text-bvbp-corporate">Customização Real</h3>
                    <p className="text-muted-foreground">
                      Não empurramos metodologia pronta - criamos soluções específicas para sua realidade
                    </p>
                  </div>
                  
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-bvbp-growth-light rounded-full flex items-center justify-center mx-auto">
                      <TrendingUp className="h-8 w-8 text-bvbp-growth" />
                    </div>
                    <h3 className="font-heading font-bold text-xl text-bvbp-corporate">ROI Transparente</h3>
                    <p className="text-muted-foreground">
                      Mostramos exatamente onde você está perdendo dinheiro e quanto pode economizar
                    </p>
                  </div>
                  
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-bvbp-growth-light rounded-full flex items-center justify-center mx-auto">
                      <Zap className="h-8 w-8 text-bvbp-growth" />
                    </div>
                    <h3 className="font-heading font-bold text-xl text-bvbp-corporate">Execução Lado a Lado</h3>
                    <p className="text-muted-foreground">
                      Não entregamos PowerPoint - somos parceiros de execução, mão na massa junto com você
                    </p>
                  </div>
                  
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-bvbp-growth-light rounded-full flex items-center justify-center mx-auto">
                      <Users className="h-8 w-8 text-bvbp-growth" />
                    </div>
                    <h3 className="font-heading font-bold text-xl text-bvbp-corporate">Autonomia em 90 dias</h3>
                    <p className="text-muted-foreground">
                      Sua equipe fica capacitada para evoluir sozinha, sem criar dependência
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
                  "Vivenciamos na prática os desafios de escalar operações em empresas de alta performance. 
                  Não teoria, mas experiência real."
                </blockquote>
                
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-bvbp-growth" />
                    <span className="text-bvbp-corporate-light">10+ anos de experiência em operações empresariais</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-bvbp-growth" />
                    <span className="text-bvbp-corporate-light">Especialização em Business Agility e Process Optimization</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-bvbp-growth" />
                    <span className="text-bvbp-corporate-light">Metodologia testada em ambientes reais de crescimento</span>
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
                  Pare de Perder Dinheiro Enquanto Você Pensa
                </h2>
                
                <p className="text-xl text-muted-foreground">
                  Cada semana de atraso são milhares de reais jogados fora. 
                  Comece com diagnóstico gratuito - sem compromisso, só clareza.
                </p>
                
                <Button size="xl" className="bg-bvbp-growth hover:bg-bvbp-growth-dark text-white text-lg px-8 py-4" onClick={() => window.location.href = '/contato'}>
                  QUERO MEU DIAGNÓSTICO GRATUITO
                </Button>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>;
};
export default Index;