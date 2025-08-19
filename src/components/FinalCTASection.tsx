import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Target, Shield, ArrowRight, MessageCircle } from "lucide-react";

const FinalCTASection = () => {
  return (
    <section className="py-16 bg-gradient-hero text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.3)_1px,transparent_0)] [background-size:20px_20px]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto">
          {/* Urgency Badge */}
          <div className="text-center mb-8">
            <Badge className="bg-bvbp-growth text-white px-6 py-2 text-sm font-semibold">
              ⏰ AÇÃO LIMITADA - ÚLTIMAS VAGAS DO TRIMESTRE
            </Badge>
          </div>

          {/* Main Headline */}
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Pare de Perder R$ 30-50 Mil por Mês
            </h2>
            <p className="text-xl md:text-2xl font-medium opacity-90 mb-6">
              Comece com diagnóstico gratuito. Sem risco, só oportunidades.
            </p>
            <p className="text-lg opacity-80 max-w-2xl mx-auto">
              Descubra exatamente onde sua empresa está perdendo dinheiro e como 
              recuperar essa economia já nos próximos 60 dias
            </p>
          </div>

          {/* Scarcity & Social Proof */}
          <Card className="p-8 mb-8 bg-white/10 backdrop-blur border-white/20">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <Clock className="h-8 w-8 mx-auto mb-3 text-bvbp-growth" />
                <div className="font-bold text-lg mb-1">Apenas 10 vagas</div>
                <div className="text-sm opacity-80">Diagnósticos gratuitos por trimestre</div>
              </div>
              <div>
                <Target className="h-8 w-8 mx-auto mb-3 text-bvbp-growth" />
                <div className="font-bold text-lg mb-1">7 vagas restantes</div>
                <div className="text-sm opacity-80">Para o Q1 2024</div>
              </div>
              <div>
                <Shield className="h-8 w-8 mx-auto mb-3 text-bvbp-growth" />
                <div className="font-bold text-lg mb-1">100% sem risco</div>
                <div className="text-sm opacity-80">Diagnóstico completamente gratuito</div>
              </div>
            </div>
          </Card>

          {/* Main CTA */}
          <div className="text-center mb-8">
            <Button 
              variant="success" 
              size="xl" 
              className="bg-white text-bvbp-corporate hover:bg-gray-100 shadow-strong text-lg px-12 py-4 h-auto font-bold group"
            >
              QUERO MEU DIAGNÓSTICO GRATUITO AGORA
              <ArrowRight className="h-6 w-6 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Alternative CTA */}
          <div className="text-center mb-12">
            <p className="text-sm opacity-80 mb-3">Prefere falar diretamente?</p>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white hover:text-bvbp-corporate"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Falar Direto no WhatsApp
            </Button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid md:grid-cols-3 gap-6 text-center text-sm opacity-90">
            <div>
              <div className="font-semibold mb-1">✓ Sem Compromisso</div>
              <div>Diagnóstico 100% gratuito</div>
            </div>
            <div>
              <div className="font-semibold mb-1">✓ Sem Receitas Prontas</div>
              <div>Análise específica da sua empresa</div>
            </div>
            <div>
              <div className="font-semibold mb-1">✓ ROI Garantido</div>
              <div>Ou nem cobramos o projeto</div>
            </div>
          </div>

          {/* Final Testimonial */}
          <Card className="mt-12 p-6 bg-white/10 backdrop-blur border-white/20">
            <div className="text-center">
              <p className="text-lg font-medium mb-4 italic">
                "Identificaram R$ 85 mil em desperdícios que nem sabíamos que existiam. 
                O diagnóstico sozinho já valeu mais que muitas consultorias pagas."
              </p>
              <div className="text-sm opacity-80">
                <strong>João Silva</strong> - CEO, TechCorp (120 funcionários)
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;