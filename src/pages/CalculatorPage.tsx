import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CalculatorHero from "@/components/calculator/CalculatorHero";
import CalculatorForm from "@/components/calculator/CalculatorForm";
import CalculatorReportPreview from "@/components/calculator/CalculatorReportPreview";
import CalculatorSocialProof from "@/components/calculator/CalculatorSocialProof";
import CalculatorFAQ from "@/components/calculator/CalculatorFAQ";
import { Helmet } from "react-helmet-async";

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

          <CalculatorReportPreview />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default CalculatorPage;