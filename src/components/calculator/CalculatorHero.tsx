import PageHero from "@/components/PageHero";
import { Calculator } from "lucide-react";

const CalculatorHero = () => {
  return (
    <PageHero
      title="Calculadora de Perdas Operacionais"
      subtitle="Quanto sua operação está custando em ineficiências?"
      description="Descubra em minutos quanto sua empresa pode estar perdendo — estimativa simples, direta e sem compromisso."
      icon={Calculator}
    />
  );
};
export default CalculatorHero;