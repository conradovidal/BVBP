import { Calculator, TrendingDown, TrendingUp } from "lucide-react";
const CalculatorHero = () => {
  return <section className="relative bg-white border-b mx-px px-0 py-20 my-12 overflow-hidden">
      <div className="absolute inset-0 bg-muted/20" />
      <div className="container mx-auto px-4 text-center relative">
        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-bvbp-corporate mb-6 max-w-4xl mx-auto animate-fade-in">
          Calculadora de ROI
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-in">
          Descubra quanto sua empresa está perdendo com processos ineficientes. 
          Cálculo baseado em dados reais de 500+ empresas brasileiras.
        </p>
      </div>
    </section>;
};
export default CalculatorHero;