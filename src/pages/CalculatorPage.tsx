import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CalculatorHero from "@/components/calculator/CalculatorHero";
import CalculatorForm, { ProcessCalculatorData, CalculatorResults } from "@/components/calculator/CalculatorForm";
import CalculatorContactSection from "@/components/calculator/CalculatorContactSection";
import { Helmet } from "react-helmet-async";

const CalculatorPage = () => {
  const [calculatorData, setCalculatorData] = useState<Partial<ProcessCalculatorData>>({});
  const [results, setResults] = useState<CalculatorResults | null>(null);

  const handleDataUpdate = (data: Partial<ProcessCalculatorData>) => {
    setCalculatorData(prev => ({ ...prev, ...data }));
  };

  const handleCalculationComplete = (calculatedResults: CalculatorResults) => {
    setResults(calculatedResults);
  };

  return (
    <>
      <Helmet>
        <title>Calculadora de Perdas Operacionais | BVBP - Descubra Quanto Está Perdendo</title>
        <meta name="description" content="Calcule quanto sua empresa está perdendo mensalmente com processos ineficientes. Resultados instantâneos em 3 minutos. 100% gratuito." />
        <meta name="keywords" content="calculadora roi, perdas operacionais, eficiência empresarial, consultoria processos, BVBP" />
        <meta name="robots" content="max-snippet:-1, max-image-preview:large" />
        <link rel="canonical" href="https://bvbp.com.br/calculadora-roi" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Calculadora de Perdas Operacionais BVBP",
          "description": "Calculadora gratuita para estimar quanto sua empresa perde mensalmente com processos ineficientes, retrabalho e gargalos operacionais.",
          "url": "https://bvbp.com.br/calculadora-roi",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "offers": {"@type": "Offer", "price": "0", "priceCurrency": "BRL"},
          "provider": {"@type": "Organization", "name": "BVBP"}
        })}</script>
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1">
          <CalculatorHero />
          
          <section className="py-10 sm:py-12 lg:py-16 bg-background">
            <div className="container mx-auto px-4">
              <CalculatorForm 
                onDataUpdate={handleDataUpdate}
                onCalculationComplete={handleCalculationComplete}
                calculatorData={calculatorData}
              />
            </div>
          </section>

          {/* Two Paths Section - Contact or Services */}
          <CalculatorContactSection 
            calculatorData={calculatorData}
            results={results}
          />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default CalculatorPage;
