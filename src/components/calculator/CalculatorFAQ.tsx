import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { MessageCircle, Calculator } from "lucide-react";
const CalculatorFAQ = () => {
  const faqs = [{
    question: "Os dados são confidenciais?",
    answer: "Totalmente. Usamos criptografia de ponta e armazenamos os dados apenas para gerar seu relatório personalizado. Nunca compartilhamos informações com terceiros e você pode solicitar a exclusão a qualquer momento."
  }, {
    question: "Vão me bombardear com ligações?",
    answer: "Não. Nosso compromisso é com a qualidade, não com vendas agressivas. Você decide se quer conversar conosco. Enviamos apenas o relatório prometido e, opcionalmente, dicas valiosas por email (se você autorizar)."
  }, {
    question: "É realmente gratuito?",
    answer: "Sim. A calculadora e o relatório são 100% gratuitos. Nosso diagnóstico completo PAGO tem mais profundidade e inclui visita presencial, mas você já recebe valor real sem pagar nada."
  }, {
    question: "Como os cálculos são feitos?",
    answer: "Baseamos nossos cálculos em benchmarks da McKinsey, Deloitte e nossa experiência com 200+ empresas. Utilizamos fórmulas conservadoras que consideram salários médios, produtividade perdida e impacto na receita."
  }, {
    question: "E se minha empresa for muito específica?",
    answer: "A calculadora funciona para 90% das SMBs. Se seu negócio tem particularidades muito específicas, o relatório indicará isso e sugeriremos uma análise personalizada mais aprofundada."
  }, {
    question: "Quanto tempo leva para receber o relatório?",
    answer: "O relatório é gerado instantaneamente e enviado por email imediatamente após você completar o formulário. Se não receber em 5 minutos, verifique sua caixa de spam."
  }];
  return;
};
export default CalculatorFAQ;