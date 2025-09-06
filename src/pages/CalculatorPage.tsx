import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import CalculatorHero from "@/components/calculator/CalculatorHero";
import CalculatorForm from "@/components/calculator/CalculatorForm";
import CalculatorReportPreview from "@/components/calculator/CalculatorReportPreview";
import CalculatorSocialProof from "@/components/calculator/CalculatorSocialProof";
import CalculatorFAQ from "@/components/calculator/CalculatorFAQ";
import { Helmet } from "react-helmet-async";
import { Search } from "lucide-react";

export interface ProcessCalculatorData {
  processType: string;
  teamSize: number;
  averageSalary: number;
  reworkHours: number;
  meetingHours: number;
}

const CalculatorPage = () => {
  const [calculatorData, setCalculatorData] = useState<Partial<ProcessCalculatorData>>({});
  const [showResults, setShowResults] = useState(false);

  const handleDataUpdate = (data: Partial<ProcessCalculatorData>) => {
    setCalculatorData(prev => ({ ...prev, ...data }));
  };

  const handleCalculationComplete = () => {
    setShowResults(true);
  };

  return (
    <>
      <Helmet>
        <title>Calculadora de Perdas Operacionais | BVBP - Descubra Quanto Está Perdendo</title>
        <meta name="description" content="Calcule quanto sua empresa está perdendo mensalmente com processos ineficientes. Relatório personalizado gratuito em 3 minutos." />
        <meta name="keywords" content="calculadora roi, perdas operacionais, eficiência empresarial, consultoria processos, BVBP" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1">
          <CalculatorHero />
          
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <CalculatorForm 
                onDataUpdate={handleDataUpdate}
                onCalculationComplete={handleCalculationComplete}
                calculatorData={calculatorData}
              />
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-gradient-subtle">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <div className="bg-white p-10 md:p-16 rounded-xl shadow-strong border-0">
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-6">
                    Quer saber como podemos ajudar sua empresa?
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
                    Conheça nossos serviços e descubra como transformamos operações bagunçadas em sistemas que funcionam.
                  </p>
                  <Button 
                    variant="hero" 
                    size="xl" 
                    className="group shadow-strong bg-green-600 hover:bg-green-500 text-white font-bold px-12 py-4 text-lg animate-pulse hover:animate-none" 
                    onClick={() => window.location.href = '/servicos'}
                  >
                    Conheça Nossos Serviços
                  </Button>
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

export default CalculatorPage;