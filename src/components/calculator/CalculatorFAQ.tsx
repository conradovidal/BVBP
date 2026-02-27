import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { MessageCircle, Calculator } from "lucide-react";
const CalculatorFAQ = () => {
  const faqs = [{
    question: "Os dados são confidenciais?",
    answer: "Totalmente. Os dados inseridos na calculadora são usados apenas para gerar os resultados na tela. Nunca compartilhamos informações com terceiros e você pode solicitar a exclusão a qualquer momento."
  }, {
    question: "Vão me bombardear com ligações?",
    answer: "Não. Nosso compromisso é com a qualidade, não com vendas agressivas. Você decide se quer conversar conosco. Só entramos em contato se você solicitar."
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
    question: "Os resultados são instantâneos?",
    answer: "Sim. Os cálculos aparecem na tela em tempo real, conforme você preenche os dados. Sem espera, sem cadastro prévio."
  }];
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Dúvidas Frequentes</h2>
          <p className="text-muted-foreground">Tudo que você precisa saber sobre nossa calculadora</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center mt-12">
            <p className="text-lg mb-6">Ainda tem dúvidas?</p>
            <Button size="lg" className="inline-flex items-center gap-2" onClick={() => window.location.href = '/contato'}>
              <MessageCircle className="h-5 w-5" />
              Falar com Especialista
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
export default CalculatorFAQ;