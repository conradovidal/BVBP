import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Play } from "lucide-react";
import heroImage from "@/assets/hero-transformation.jpg";

const HeroSection = () => {
  const valueBullets = [
    "Soluções customizadas para sua realidade específica",
    "25-40% redução no tempo operacional em 60 dias",
    "Equipes autônomas em 90 dias (não criamos dependência)",
    "ROI transparente e comprovado"
  ];

  return (
    <section id="inicio" className="relative py-16 lg:py-24 bg-gradient-subtle overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-bvbp-corporate leading-tight">
                Somos parceiros de negócio que transformam{" "}
                <span className="text-bvbp-growth">processos bagunçados</span>{" "}
                em operações que realmente funcionam,{" "}
                <span className="text-bvbp-growth">lado a lado com você</span>
              </h1>
            </div>

            {/* Sub-headline */}
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Parceria boutique para SMBs. Diagnóstico gratuito, soluções sob medida 
              e <span className="font-semibold text-bvbp-growth">resultados mensuráveis em até 90 dias</span>.
              Colocamos a <span className="font-semibold text-bvbp-corporate">mão na massa</span> e executamos 
              junto com sua equipe.
            </p>

            {/* Value Bullets */}
            <div className="space-y-3">
              {valueBullets.map((bullet, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-bvbp-growth mt-0.5 flex-shrink-0" />
                  <span className="text-foreground font-medium">{bullet}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="xl" className="group">
                QUERO MEU DIAGNÓSTICO GRATUITO
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline-hero" size="xl" className="group">
                <Play className="h-5 w-5" />
                Ver Cases de Sucesso
              </Button>
            </div>

            {/* Trust Indicator */}
            <div className="flex items-center space-x-4 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-success border-2 border-white" />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold text-bvbp-growth">50+ empresas</span> já transformaram 
                seus processos conosco
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-strong">
              <img 
                src={heroImage} 
                alt="Transformação de processos caóticos em operações organizadas" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-bvbp-corporate/20 to-transparent" />
            </div>
            
            {/* Floating metrics */}
            <div className="absolute -top-4 -left-4 bg-white p-4 rounded-lg shadow-soft border">
              <div className="text-2xl font-bold text-bvbp-growth">25-40%</div>
              <div className="text-sm text-muted-foreground">Redução de Tempo</div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-lg shadow-soft border">
              <div className="text-2xl font-bold text-bvbp-corporate">90 dias</div>
              <div className="text-sm text-muted-foreground">Para Autonomia</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;