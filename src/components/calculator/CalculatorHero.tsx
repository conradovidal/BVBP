import { Calculator, TrendingDown, TrendingUp } from "lucide-react";
const CalculatorHero = () => {
  return <section className="bg-gradient-subtle border-b mx-px my-0 px-0 py-[49px]">
      <div className="container mx-auto px-4 text-center">
        

        <h1 className="font-heading text-4xl lg:text-5xl font-bold text-foreground mb-6 max-w-4xl mx-auto">
          Quanto sua operação está{" "}
          <span className="text-destructive">custando em ineficiências?</span>
        </h1>

        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Descubra em 3 passos rápidos. Estimativa personalizada, sem jargão, sem compromisso.
        </p>

        <div className="flex items-center justify-center gap-8 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 p-4 bg-destructive/10 rounded-lg">
            <TrendingDown className="h-8 w-8 text-destructive" />
            <div className="text-left">
              <div className="font-semibold text-destructive">Perdas Atuais</div>
              <div className="text-sm text-muted-foreground">Processos ineficientes</div>
            </div>
          </div>

          <div className="text-2xl text-muted-foreground">→</div>

          <div className="flex items-center gap-3 p-4 bg-success/10 rounded-lg">
            <TrendingUp className="h-8 w-8 text-success" />
            <div className="text-left">
              <div className="font-semibold text-success">Economia Potencial</div>
              <div className="text-sm text-muted-foreground">Com otimização BVBP</div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default CalculatorHero;