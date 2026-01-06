import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Check, X, AlertTriangle, Mail } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const DiagnosticoOperacionalPage = () => {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: paraQuemRef, isVisible: paraQuemVisible } = useScrollAnimation();
  const { ref: problemaRef, isVisible: problemaVisible } = useScrollAnimation();
  const { ref: escopoRef, isVisible: escopoVisible } = useScrollAnimation();
  const { ref: comoFuncionaRef, isVisible: comoFuncionaVisible } = useScrollAnimation();
  const { ref: entregaveisRef, isVisible: entregaveisVisible } = useScrollAnimation();
  const { ref: prazoRef, isVisible: prazoVisible } = useScrollAnimation();
  const { ref: resultadoRef, isVisible: resultadoVisible } = useScrollAnimation();
  const { ref: comercialRef, isVisible: comercialVisible } = useScrollAnimation();
  const { ref: proximosRef, isVisible: proximosVisible } = useScrollAnimation();
  const { ref: faqRef, isVisible: faqVisible } = useScrollAnimation();
  const { ref: contatoRef, isVisible: contatoVisible } = useScrollAnimation();

  const scrollToContato = () => {
    document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" });
  };

  const heroBullets = [
    "Escopo fixo, sem virar consultoria infinita",
    "1 fluxo crítico, baseline e prioridades objetivas",
    "Saída com plano claro de 2 semanas",
  ];

  const funcionaBemPara = [
    "Cresceram mais rápido do que a estrutura operacional",
    "Sentem fricção constante, atrasos ou retrabalho",
    "Dependem demais do fundador para decisões",
    "Querem clareza antes de investir em mudanças",
  ];

  const naoEPara = [
    "Programas genéricos de cultura ou motivação",
    "Decks de estratégia sem aterrissagem na operação",
  ];

  const problemaBullets = [
    "Escolha de 1 fluxo crítico",
    "Gargalos e fricções claros",
    "Prioridades objetivas para agir",
  ];

  const escopoItems = [
    "1 fluxo operacional crítico",
    "Mapeamento do estado atual",
    "Análise de gargalos e fricções",
    "Baseline simples de atrasos, retrabalho e pontos de decisão",
    "Plano de ação para as próximas 2 semanas",
  ];

  const comoFuncionaSteps = [
    "Alinhamento de kickoff (30–45 min)",
    "2 a 3 entrevistas objetivas (liderança + papéis-chave)",
    "Mapeamento e análise do fluxo",
    "Síntese e priorização",
    "Apresentação executiva dos achados (readout)",
  ];

  const entregaveis = [
    "Documento executivo (5–8 páginas)",
    "Mapa visual do fluxo selecionado",
    "Lista clara dos 3 principais gargalos operacionais",
    "Plano de ação de 2 semanas",
    "Recomendação: seguir adiante ou parar (parar é um resultado válido)",
  ];

  const resultadoBullets = [
    "Clareza sobre onde a operação está 'vazando' tempo e energia",
    "Um ponto de partida nítido para melhorar",
    "Menos risco de investir em iniciativas erradas",
  ];

  const comercialBullets = [
    "Escopo fixo",
    "Prazo fixo",
    "Preço definido caso a caso",
  ];

  const proximosPassos = [
    "Sprint de Otimização de Processo",
    "Configuração de Gestão e Entrega de Projetos",
    "Ou parar por aqui (o que também é um bom resultado)",
  ];

  const faqs = [
    {
      question: "Isso é um trabalho de estratégia?",
      answer:
        "Não. É uma checagem de realidade operacional, com foco em um fluxo crítico e próximos passos claros.",
    },
    {
      question: "Quantas pessoas precisam participar?",
      answer:
        "Normalmente liderança e 1 a 2 papéis-chave do fluxo. Sem envolver toda a empresa.",
    },
    {
      question: "O que eu recebo no final?",
      answer:
        "Documento executivo, mapa do fluxo, top 3 gargalos e plano de 2 semanas.",
    },
    {
      question: "Preciso já ter ferramentas e processos maduros?",
      answer:
        "Não. A ideia é justamente trazer clareza mesmo em contextos desorganizados.",
    },
    {
      question: "E se a recomendação for não seguir?",
      answer: "Ótimo. Você evita investir tempo e dinheiro no lugar errado.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Diagnóstico Operacional | BVBP</title>
        <meta
          name="description"
          content="Diagnóstico curto e baseado em fatos para identificar onde a operação trava e o que corrigir primeiro. Escopo fixo, 1 fluxo crítico, plano de 2 semanas."
        />
      </Helmet>

      <Header />

      <main>
        {/* Seção 1: Hero */}
        <section
          ref={heroRef}
          className={`py-20 lg:py-28 bg-gradient-hero transition-all duration-700 ${
            heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Diagnóstico Operacional
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                Um diagnóstico curto e baseado em fatos para identificar onde a
                operação realmente está travando e o que atacar primeiro.
              </p>

              <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6 mb-8">
                {heroBullets.map((bullet, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center gap-2 text-white/90"
                  >
                    <Check className="h-5 w-5 text-bvbp-growth flex-shrink-0" />
                    <span className="text-sm md:text-base">{bullet}</span>
                  </div>
                ))}
              </div>

              <Button
                variant="success"
                size="xl"
                onClick={scrollToContato}
                className="mb-4"
              >
                Quero entender meu gargalo
              </Button>

              <p className="text-white/60 text-sm max-w-md mx-auto">
                Sem compromisso de continuidade. O diagnóstico pode terminar em
                "não seguir adiante".
              </p>
            </div>
          </div>
        </section>

        {/* Seção 2: Para quem é */}
        <section
          ref={paraQuemRef}
          className={`py-16 lg:py-20 bg-gray-50 transition-all duration-700 ${
            paraQuemVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-6 text-center">
                Para quem é
              </h2>
              <p className="text-lg text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
                Funciona melhor para empresas que precisam de clareza
                operacional antes de investir em execução.
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-6 md:p-8 shadow-soft border-gray-100">
                  <h3 className="font-heading text-xl font-semibold text-bvbp-corporate mb-4">
                    Funciona bem para
                  </h3>
                  <ul className="space-y-3">
                    {funcionaBemPara.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-bvbp-growth flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="p-6 md:p-8 shadow-soft border-gray-100">
                  <h3 className="font-heading text-xl font-semibold text-bvbp-corporate mb-4">
                    Não é para
                  </h3>
                  <ul className="space-y-3">
                    {naoEPara.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Seção 3: O problema que resolve */}
        <section
          ref={problemaRef}
          className={`py-16 lg:py-20 bg-white transition-all duration-700 ${
            problemaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-8 text-center">
                O problema que resolve
              </h2>

              <Card className="p-8 md:p-10 bg-gray-50 border-l-4 border-l-bvbp-growth mb-8">
                <p className="text-xl md:text-2xl text-bvbp-corporate font-medium italic">
                  "Sabemos que algo está errado na operação, mas não sabemos por
                  onde começar."
                </p>
              </Card>

              <div className="flex flex-col md:flex-row justify-center gap-6">
                {problemaBullets.map((bullet, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 text-muted-foreground"
                  >
                    <Check className="h-5 w-5 text-bvbp-growth flex-shrink-0" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Seção 4: Escopo */}
        <section
          ref={escopoRef}
          className={`py-16 lg:py-20 bg-gray-50 transition-all duration-700 ${
            escopoVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-8 text-center">
                Escopo (deliberadamente limitado)
              </h2>

              <Card className="p-6 md:p-8 shadow-soft border-gray-100 mb-8">
                <ul className="space-y-4">
                  {escopoItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-bvbp-growth flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6 bg-amber-50 border border-amber-200 flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-800">
                    Regra: não analisamos a empresa inteira.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Seção 5: Como funciona */}
        <section
          ref={comoFuncionaRef}
          className={`py-16 lg:py-20 bg-white transition-all duration-700 ${
            comoFuncionaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-10 text-center">
                Como funciona
              </h2>

              <div className="space-y-4">
                {comoFuncionaSteps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-bvbp-corporate text-white flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <p className="text-lg text-muted-foreground pt-2">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Seção 6: Entregáveis */}
        <section
          ref={entregaveisRef}
          className={`py-16 lg:py-20 bg-gray-50 transition-all duration-700 ${
            entregaveisVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-8 text-center">
                Entregáveis
              </h2>

              <Card className="p-6 md:p-8 shadow-soft border-gray-100">
                <ul className="space-y-4">
                  {entregaveis.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-bvbp-growth flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Seção 7: Prazo */}
        <section
          ref={prazoRef}
          className={`py-16 lg:py-20 bg-white transition-all duration-700 ${
            prazoVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-6">
                Prazo
              </h2>
              <Card className="p-8 shadow-soft border-gray-100">
                <p className="text-xl text-muted-foreground">
                  <span className="font-semibold text-bvbp-corporate">
                    10 a 15 dias corridos
                  </span>
                  , com escopo e ritmo definidos desde o início.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Seção 8: Resultado esperado */}
        <section
          ref={resultadoRef}
          className={`py-16 lg:py-20 bg-gray-50 transition-all duration-700 ${
            resultadoVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-8 text-center">
                O que muda ao final
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {resultadoBullets.map((bullet, index) => (
                  <Card
                    key={index}
                    className="p-6 shadow-soft border-gray-100 text-center"
                  >
                    <Check className="h-8 w-8 text-bvbp-growth mx-auto mb-4" />
                    <p className="text-muted-foreground">{bullet}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Seção 9: Comercial */}
        <section
          ref={comercialRef}
          className={`py-16 lg:py-20 bg-white transition-all duration-700 ${
            comercialVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-8">
                Modelo comercial
              </h2>

              <div className="flex flex-col md:flex-row justify-center gap-6">
                {comercialBullets.map((bullet, index) => (
                  <Card
                    key={index}
                    className="p-6 shadow-soft border-gray-100 flex-1"
                  >
                    <p className="text-lg font-medium text-bvbp-corporate">
                      {bullet}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Seção 10: Próximos passos */}
        <section
          ref={proximosRef}
          className={`py-16 lg:py-20 bg-gray-50 transition-all duration-700 ${
            proximosVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-6 text-center">
                Próximos passos
              </h2>
              <p className="text-lg text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
                Dependendo do diagnóstico, o próximo passo pode ser um sprint de
                otimização, a configuração do sistema de projetos, ou nenhum
                próximo passo.
              </p>

              <Card className="p-6 md:p-8 shadow-soft border-gray-100">
                <ul className="space-y-4">
                  {proximosPassos.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="h-2 w-2 rounded-full bg-bvbp-growth flex-shrink-0 mt-2" />
                      <span className="text-muted-foreground text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Seção 11: FAQ */}
        <section
          ref={faqRef}
          className={`py-16 lg:py-20 bg-white transition-all duration-700 ${
            faqVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-10 text-center">
                Perguntas frequentes
              </h2>

              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border-b border-gray-200"
                  >
                    <AccordionTrigger className="text-left font-medium text-bvbp-corporate hover:text-bvbp-growth py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Seção 12: Contato */}
        <section
          id="contato"
          ref={contatoRef}
          className={`py-16 lg:py-20 bg-gray-50 transition-all duration-700 ${
            contatoVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-6">
                Contato
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Manda um email com contexto e qual fluxo está mais travado. A
                gente responde com os próximos passos.
              </p>

              <Card className="p-8 shadow-soft border-gray-100">
                <div className="space-y-4">
                  <a
                    href="mailto:conrado@bvbp.com.br?subject=Diagnóstico%20Operacional"
                    className="flex items-center justify-center gap-3 text-lg text-bvbp-corporate hover:text-bvbp-growth transition-colors"
                  >
                    <Mail className="h-5 w-5" />
                    conrado@bvbp.com.br
                  </a>
                  <a
                    href="mailto:cristiano@bvbp.com.br?subject=Diagnóstico%20Operacional"
                    className="flex items-center justify-center gap-3 text-lg text-bvbp-corporate hover:text-bvbp-growth transition-colors"
                  >
                    <Mail className="h-5 w-5" />
                    cristiano@bvbp.com.br
                  </a>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default DiagnosticoOperacionalPage;
