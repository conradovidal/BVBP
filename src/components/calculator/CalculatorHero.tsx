import { Calculator, TrendingDown, TrendingUp } from "lucide-react";
const CalculatorHero = () => {
  return <section className="bg-gradient-subtle border-b mx-px px-0 py-[49px] my-[45px]">
      <div className="container mx-auto px-4 text-center">
        

        <h1 className="font-heading text-4xl lg:text-5xl font-bold text-foreground mb-6 max-w-4xl mx-auto">
          Quanto sua operação está{" "}
          <span className="text-destructive">custando em ineficiências?</span>
        </h1>

        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Descubra em minutos quanto sua empresa pode estar perdendo — estimativa simples, direta e sem compromisso.
        </p>

        
      </div>
    </section>;
};
export default CalculatorHero;