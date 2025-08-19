import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const FAQSection = () => {
  const faqs = [
    {
      question: "Como vocês são diferentes das outras consultorias?",
      answer: "Não empurramos metodologia pronta. Cada solução é desenhada especificamente para sua empresa, considerando sua cultura, limitações e objetivos únicos. Em 90 dias você fica autônomo, não dependente. Outras consultorias criam dependência para manter contratos longos - nós fazemos o oposto."
    },
    {
      question: "E se não funcionar?",
      answer: "Começamos com diagnóstico gratuito. Se não identificarmos pelo menos R$ 30 mil em oportunidades de economia mensuráveis, nem cobramos o projeto. Além disso, acompanhamos todos os resultados com métricas transparentes desde o primeiro dia."
    },
    {
      question: "Quanto tempo para ver resultados?",
      answer: "Primeiros quick wins em 30 dias (melhorias imediatas visíveis). Resultados mensuráveis e ROI comprovado em 60 dias. Autonomia completa da sua equipe em 90 dias. Diferente de outras consultorias que prometem resultados em 6-12 meses."
    },
    {
      question: "Atendem só em Porto Alegre?",
      answer: "Atendemos todo Brasil presencial ou remoto, conforme a necessidade do projeto. Internacional também via online. Temos experiência com empresas de todos os portes, de startups a corporações com 500+ funcionários."
    },
    {
      question: "Qual o investimento?",
      answer: "De R$ 6.500 (Quick Win - 1 processo) a R$ 22.000 (Transformation - sistêmico completo). O ROI típico é 300%+ no primeiro ano. Muitos clientes recuperam o investimento apenas com a economia dos primeiros 2-3 meses."
    },
    {
      question: "Como garantem que os resultados vão se manter?",
      answer: "Capacitamos sua equipe para ser autônoma. Documentamos todos os processos, criamos métricas de acompanhamento e treinamos seus colaboradores. Ao final dos 90 dias, vocês não precisam mais de nós - essa é nossa garantia de sucesso real."
    },
    {
      question: "Trabalham com empresas do meu setor?",
      answer: "Sim. Nossa metodologia é agnóstica ao setor porque focamos em processos fundamentais que existem em qualquer empresa: gestão, operação, vendas, financeiro. Já atendemos tecnologia, manufatura, serviços, e-commerce, saúde e mais."
    },
    {
      question: "E se minha empresa for muito pequena/grande?",
      answer: "Atendemos SMBs de 50-200 funcionários e faturamento R$ 5-100MM - esse é nosso sweet spot. Empresas menores ainda não têm complexidade suficiente; maiores já têm estruturas próprias. Nessa faixa é onde geramos mais impacto."
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Respostas diretas para as dúvidas mais comuns sobre nossa metodologia e resultados
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="p-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-semibold text-bvbp-corporate hover:text-bvbp-growth">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </div>

        {/* Still Have Questions CTA */}
        <div className="text-center">
          <Card className="inline-block p-8 bg-gradient-subtle border-0">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gradient-hero flex items-center justify-center">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              
              <div>
                <h3 className="font-heading text-xl font-bold text-bvbp-corporate mb-2">
                  Ainda tem dúvidas?
                </h3>
                <p className="text-muted-foreground mb-4">
                  Fale diretamente com nossos especialistas
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="hero" size="lg">
                  Agendar Conversa
                </Button>
                <Button variant="outline-hero" size="lg">
                  WhatsApp Direto
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;