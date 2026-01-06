import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { X, AlertTriangle, FileText, Map, ListChecks, Calendar, ArrowRight, Search, Lightbulb, TrendingUp, Clock, MailIcon } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const DiagnosticoOperacionalPage = () => {
  const { toast } = useToast();
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: paraQuemRef, isVisible: paraQuemVisible } = useScrollAnimation();
  const { ref: escopoRef, isVisible: escopoVisible } = useScrollAnimation();
  const { ref: comoFuncionaRef, isVisible: comoFuncionaVisible } = useScrollAnimation();
  const { ref: entregaveisRef, isVisible: entregaveisVisible } = useScrollAnimation();
  const { ref: resultadoRef, isVisible: resultadoVisible } = useScrollAnimation();
  const { ref: proximosRef, isVisible: proximosVisible } = useScrollAnimation();
  const { ref: faqRef, isVisible: faqVisible } = useScrollAnimation();
  const { ref: contatoRef, isVisible: contatoVisible } = useScrollAnimation();

  const scrollToContato = () => {
    document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" });
  };

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    interest: "Diagnóstico Operacional",
    challenge: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast({
        title: "Recebemos seus dados.",
        description: "Responderemos em até 4 horas úteis."
      });
      setIsSubmitting(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        role: "",
        interest: "Diagnóstico Operacional",
        challenge: ""
      });
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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

  const escopoItems = [
    "1 fluxo operacional crítico",
    "Mapeamento do estado atual",
    "Análise de gargalos e fricções",
    "Baseline simples de atrasos, retrabalho e pontos de decisão",
    "Plano de ação para as próximas 2 semanas",
  ];

  const comoFuncionaSteps = [
    "Kickoff",
    "Entrevistas",
    "Mapeamento",
    "Síntese",
    "Readout",
  ];

  const comoFuncionaDescriptions = [
    "Alinhamento inicial (30–45 min)",
    "2 a 3 conversas objetivas",
    "Análise do fluxo crítico",
    "Priorização dos achados",
    "Apresentação executiva",
  ];

  const entregaveis = [
    { icon: FileText, text: "Documento executivo (5–8 páginas)" },
    { icon: Map, text: "Mapa visual do fluxo selecionado" },
    { icon: ListChecks, text: "Lista clara dos 3 principais gargalos operacionais" },
    { icon: Calendar, text: "Plano de ação de 2 semanas" },
    { icon: ArrowRight, text: "Recomendação: seguir adiante ou parar" },
  ];

  const resultadoBullets = [
    { icon: Search, text: "Clareza sobre onde a operação está 'vazando' tempo e energia" },
    { icon: Lightbulb, text: "Um ponto de partida nítido para melhorar" },
    { icon: TrendingUp, text: "Menos risco de investir em iniciativas erradas" },
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

  const emails = [
    { email: "conrado@bvbp.com.br", link: "mailto:conrado@bvbp.com.br?subject=Diagnóstico%20Operacional" },
    { email: "cristiano@bvbp.com.br", link: "mailto:cristiano@bvbp.com.br?subject=Diagnóstico%20Operacional" }
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
          className={`py-16 lg:py-24 bg-gradient-hero transition-all duration-700 ${
            heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Diagnóstico Operacional
              </h1>
              
              <p className="text-xl md:text-2xl text-white/90 mb-6 max-w-3xl mx-auto leading-relaxed italic">
                "Sabemos que algo está errado na operação, mas não sabemos por onde começar."
              </p>

              <p className="text-lg text-white/80 mb-8">
                Escopo fixo · 1 fluxo crítico · 1 plano de otimização de 2 semanas
              </p>

              <Button
                variant="success"
                size="xl"
                onClick={scrollToContato}
                className="mb-4"
              >
                Quero entender meu gargalo
              </Button>

              <p className="text-white/60 text-sm max-w-md mx-auto">
                Sem compromisso de continuidade. O diagnóstico pode terminar em "não seguir adiante".
              </p>
            </div>
          </div>
        </section>

        {/* Seção 2: Para quem é */}
        <section
          ref={paraQuemRef}
          className={`py-12 lg:py-16 bg-gray-50 transition-all duration-700 ${
            paraQuemVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-6 text-center">
                Para quem é
              </h2>
              <p className="text-lg text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
                Funciona melhor para empresas que precisam de clareza operacional antes de investir em execução.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 shadow-soft border-gray-100">
                  <h3 className="font-heading text-xl font-semibold text-bvbp-corporate mb-4">
                    Funciona bem para
                  </h3>
                  <ul className="space-y-3">
                    {funcionaBemPara.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-bvbp-growth font-bold mt-0.5">•</span>
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="p-6 shadow-soft border-gray-100">
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

        {/* Seção 3: Escopo */}
        <section
          ref={escopoRef}
          className={`py-12 lg:py-16 bg-white transition-all duration-700 ${
            escopoVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-8 text-center">
                Escopo (deliberadamente limitado)
              </h2>

              <Card className="p-6 shadow-soft border-gray-100 mb-6">
                <ul className="space-y-3">
                  {escopoItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-bvbp-growth font-bold mt-0.5">•</span>
                      <span className="text-muted-foreground text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-4 bg-amber-50 border border-amber-200 flex items-start gap-4">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="font-medium text-amber-800">
                  Regra: não analisamos a empresa inteira.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Seção 4: Como funciona - Horizontal */}
        <section
          ref={comoFuncionaRef}
          className={`py-12 lg:py-16 bg-gray-50 transition-all duration-700 ${
            comoFuncionaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-10 text-center">
                Como funciona
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
                {comoFuncionaSteps.map((step, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 mx-auto rounded-full bg-bvbp-corporate text-white flex items-center justify-center font-bold text-xl mb-3">
                      {index + 1}
                    </div>
                    <p className="font-semibold text-bvbp-corporate mb-1">{step}</p>
                    <p className="text-sm text-muted-foreground">{comoFuncionaDescriptions[index]}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Seção 5: Entregáveis + Prazo */}
        <section
          ref={entregaveisRef}
          className={`py-12 lg:py-16 bg-white transition-all duration-700 ${
            entregaveisVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Entregáveis - 2/3 */}
                <div className="lg:col-span-2">
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-6">
                    Entregáveis
                  </h2>
                  <Card className="p-6 shadow-soft border-gray-100">
                    <ul className="space-y-4">
                      {entregaveis.map((item, index) => {
                        const IconComponent = item.icon;
                        return (
                          <li key={index} className="flex items-start gap-3">
                            <IconComponent className="h-5 w-5 text-bvbp-growth flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{item.text}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </Card>
                </div>

                {/* Prazo - 1/3 */}
                <div>
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-6">
                    Prazo
                  </h2>
                  <Card className="p-6 bg-bvbp-corporate text-white h-fit">
                    <Clock className="h-8 w-8 mb-4" />
                    <p className="text-2xl font-bold mb-2">10–15 dias</p>
                    <p className="text-white/80 text-sm">Escopo e ritmo definidos desde o início</p>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção 6: O que muda */}
        <section
          ref={resultadoRef}
          className={`py-12 lg:py-16 bg-gray-50 transition-all duration-700 ${
            resultadoVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-8 text-center">
                O que muda ao final
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {resultadoBullets.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <Card
                      key={index}
                      className="p-6 shadow-soft border-gray-100 text-center"
                    >
                      <IconComponent className="h-8 w-8 text-bvbp-growth mx-auto mb-4" />
                      <p className="text-muted-foreground">{item.text}</p>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Seção 7: Próximos passos */}
        <section
          ref={proximosRef}
          className={`py-12 lg:py-16 bg-white transition-all duration-700 ${
            proximosVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-6 text-center">
                Próximos passos
              </h2>
              <p className="text-lg text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
                Dependendo do diagnóstico, o próximo passo pode ser um sprint de otimização, a configuração do sistema de projetos, ou nenhum próximo passo.
              </p>

              <Card className="p-6 shadow-soft border-gray-100">
                <ul className="space-y-3">
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

        {/* Seção 8: FAQ */}
        <section
          ref={faqRef}
          className={`py-12 lg:py-16 bg-gray-50 transition-all duration-700 ${
            faqVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-8 text-center">
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

        {/* Seção 9: Contato - Formulário completo */}
        <section
          id="contato"
          ref={contatoRef}
          className={`py-16 lg:py-20 bg-white transition-all duration-700 ${
            contatoVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-4">
                Vamos conversar?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Conte-nos sobre seu principal gargalo operacional e entraremos em contato em até 4 horas úteis.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Contact Form */}
              <div>
                <Card className="p-8">
                  <div className="mb-6">
                    <h3 className="font-heading text-2xl font-bold text-bvbp-corporate mb-2">
                      Envie sua Mensagem
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Preencha o formulário abaixo
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome completo *</Label>
                      <Input 
                        id="name" 
                        value={formData.name} 
                        onChange={e => handleInputChange("name", e.target.value)} 
                        placeholder="Seu nome completo" 
                        required 
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={e => handleInputChange("email", e.target.value)} 
                        placeholder="seu@email.com" 
                        required 
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone *</Label>
                      <Input 
                        id="phone" 
                        value={formData.phone} 
                        onChange={e => handleInputChange("phone", e.target.value)} 
                        placeholder="+55 51 99999-9999" 
                        required 
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Empresa</Label>
                      <Input 
                        id="company" 
                        value={formData.company} 
                        onChange={e => handleInputChange("company", e.target.value)} 
                        placeholder="Nome da sua empresa" 
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Cargo/Função</Label>
                      <Select value={formData.role} onValueChange={value => handleInputChange("role", value)}>
                        <SelectTrigger className="bg-background border-input">
                          <SelectValue placeholder="Selecione seu cargo" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-input z-50">
                          <SelectItem value="ceo">CEO/Founder</SelectItem>
                          <SelectItem value="diretor">Diretor/Executivo</SelectItem>
                          <SelectItem value="gerente">Gerente/Coordenador</SelectItem>
                          <SelectItem value="analista">Analista/Especialista</SelectItem>
                          <SelectItem value="consultor">Consultor</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="interest">Serviço de interesse</Label>
                      <Select value={formData.interest} onValueChange={value => handleInputChange("interest", value)}>
                        <SelectTrigger className="bg-background border-input">
                          <SelectValue placeholder="Selecione um serviço" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-input z-50">
                          <SelectItem value="Diagnóstico Operacional">Diagnóstico Operacional</SelectItem>
                          <SelectItem value="Sprint de Otimização de Processo">Sprint de Otimização de Processo</SelectItem>
                          <SelectItem value="Configuração de Gestão e Entrega de Projetos">Configuração de Gestão e Entrega de Projetos</SelectItem>
                          <SelectItem value="Configuração de Governança de Execução">Configuração de Governança de Execução</SelectItem>
                          <SelectItem value="Programa Customizado de Melhoria">Programa Customizado de Melhoria</SelectItem>
                          <SelectItem value="Outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="challenge">Maior desafio operacional atual? *</Label>
                      <Textarea 
                        id="challenge" 
                        value={formData.challenge} 
                        onChange={e => handleInputChange("challenge", e.target.value)} 
                        placeholder="Conte-nos sobre seus principais desafios operacionais..." 
                        rows={3} 
                        required 
                      />
                    </div>

                    <div className="flex items-center space-x-3">
                      <Checkbox id="consent" required />
                      <Label htmlFor="consent" className="text-sm text-muted-foreground">
                        Concordo que a BVBP entre em contato sobre minha solicitação.
                      </Label>
                    </div>

                    <Button type="submit" variant="hero" size="xl" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "ENVIANDO..." : "QUERO AGENDAR CONVERSA"}
                    </Button>
                  </form>
                </Card>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h3 className="font-heading text-2xl font-bold text-bvbp-corporate mb-6">
                    Fale Direto Conosco
                  </h3>

                  <Card className="p-6">
                    <p className="text-muted-foreground mb-4">Resposta em até 4 horas úteis</p>
                    
                    <div className="space-y-3">
                      {emails.map((item, index) => (
                        <a 
                          key={index}
                          href={item.link}
                          className="flex items-center space-x-2 text-lg font-medium text-bvbp-corporate hover:text-bvbp-growth transition-colors"
                        >
                          <MailIcon className="h-5 w-5" />
                          <span>{item.email}</span>
                        </a>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default DiagnosticoOperacionalPage;
