import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { MessageCircle, Calculator } from "lucide-react";

const CalculatorFAQ = () => {
  const faqs = [
    {
      question: "Os dados são confidenciais?",
      answer: "Totalmente. Usamos criptografia de ponta e armazenamos os dados apenas para gerar seu relatório personalizado. Nunca compartilhamos informações com terceiros e você pode solicitar a exclusão a qualquer momento."
    },
    {
      question: "Vão me bombardear com ligações?",
      answer: "Não. Nosso compromisso é com a qualidade, não com vendas agressivas. Você decide se quer conversar conosco. Enviamos apenas o relatório prometido e, opcionalmente, dicas valiosas por email (se você autorizar)."
    },
    {
      question: "É realmente gratuito?",
      answer: "Sim. A calculadora e o relatório são 100% gratuitos. Nosso diagnóstico completo PAGO tem mais profundidade e inclui visita presencial, mas você já recebe valor real sem pagar nada."
    },
    {
      question: "Como os cálculos são feitos?",
      answer: "Baseamos nossos cálculos em benchmarks da McKinsey, Deloitte e nossa experiência com 200+ empresas. Utilizamos fórmulas conservadoras que consideram salários médios, produtividade perdida e impacto na receita."
    },
    {
      question: "E se minha empresa for muito específica?",
      answer: "A calculadora funciona para 90% das SMBs. Se seu negócio tem particularidades muito específicas, o relatório indicará isso e sugeriremos uma análise personalizada mais aprofundada."
    },
    {
      question: "Quanto tempo leva para receber o relatório?",
      answer: "O relatório é gerado instantaneamente e enviado por email imediatamente após você completar o formulário. Se não receber em 5 minutos, verifique sua caixa de spam."
    }
  ];

  return (
    <section className="py-16 bg-background border-t">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-lg text-muted-foreground">
            Esclarecemos as dúvidas mais comuns sobre nossa calculadora
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-12">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="font-semibold text-foreground">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center bg-gradient-subtle p-8 rounded-lg max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Ainda não calculou? Você pode estar perdendo <br />
            <span className="text-destructive">R$ 30-50 mil por mês</span> sem saber
          </h3>
          
          <p className="text-muted-foreground mb-6 text-lg">
            ⏰ A cada dia que passa, você perde aproximadamente R$ 1.500-2.000 <br />
            📈 Empresas que agem rápido recuperam o investimento em 60 dias
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="default" className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Calcular Agora
            </Button>
            
            <Button size="lg" variant="outline" className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Falar com Especialista
            </Button>
          </div>

          <div className="mt-6 text-sm text-muted-foreground">
            🔒 Seus dados são 100% confidenciais • ⚡ Resultado em 3 minutos • 📧 Relatório por email
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalculatorFAQ;