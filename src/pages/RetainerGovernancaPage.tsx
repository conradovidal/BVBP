import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import {
  Shield,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  Zap,
  Target,
  Users,
  ClipboardList,
  Settings,
  BarChart3,
  Handshake,
  ArrowRight,
  Clock,
  FileText,
  Calendar,
  Mail,
  MailIcon,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ServiceBreadcrumb, OtherServicesSection } from "@/components/ServiceNavigation";

const RetainerGovernancaPage = () => {
  const { toast } = useToast();
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: preReqRef, isVisible: preReqVisible } = useScrollAnimation();
  const { ref: paraQuemRef, isVisible: paraQuemVisible } = useScrollAnimation();
  const { ref: escopoRef, isVisible: escopoVisible } = useScrollAnimation();
  const { ref: comoFuncionaRef, isVisible: comoFuncionaVisible } = useScrollAnimation();
  const { ref: entregaveisRef, isVisible: entregaveisVisible } = useScrollAnimation();
  const { ref: resultadoRef, isVisible: resultadoVisible } = useScrollAnimation();
  const { ref: proximosRef, isVisible: proximosVisible } = useScrollAnimation();
  const { ref: faqRef, isVisible: faqVisible } = useScrollAnimation();
  const { ref: contatoRef, isVisible: contatoVisible } = useScrollAnimation();

  const scrollToContact = () => {
    document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" });
  };

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    interest: "Retainer de Execução e Governança",
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
        interest: "Retainer de Execução e Governança",
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

  const emails = [
    { email: "conrado@bvbp.com.br", link: "mailto:conrado@bvbp.com.br?subject=Contato%20BVBP%20-%20Retainer%20Governança" },
    { email: "cristiano@bvbp.com.br", link: "mailto:cristiano@bvbp.com.br?subject=Contato%20BVBP%20-%20Retainer%20Governança" }
  ];

  const idealFor = [
    "Empresas que já melhoraram parte da operação",
    "Querem evitar regressão ao caos anterior",
    "Precisam de visibilidade contínua sem burocracia pesada",
    "Querem suporte externo para manter a execução honesta",
  ];

  const notFor = [
    "Empresas que buscam terceirizar a execução ou delivery",
    "Quem quer adicionar mais mãos na operação",
    "Organizações que ainda não sabem onde está o problema — oferecemos um diagnóstico operacional para isso",
  ];

  const scopeItems = [
    "Check-ins regulares de execução e governança",
    "Revisão de prioridades, progresso e bloqueios",
    "Suporte a decisões da liderança",
    "Ajustes leves em processos e cadência",
    "Advisory sobre riscos de execução",
  ];

  const steps = [
    { number: 1, title: "Cadência", description: "Definição da cadência mensal", icon: Calendar },
    { number: 2, title: "Governança", description: "Sessões recorrentes de governança", icon: Users },
    { number: 3, title: "Revisão", description: "Revisão contínua de sinais de execução", icon: Eye },
    { number: 4, title: "Ajustes", description: "Ajustes direcionados conforme necessário", icon: Settings },
    { number: 5, title: "Recalibragem", description: "Recalibragem periódica com liderança", icon: Target },
  ];

  const deliverables = [
    { icon: Calendar, text: "Cadência e agenda de governança" },
    { icon: BarChart3, text: "Snapshots de saúde da execução" },
    { icon: ClipboardList, text: "Inputs para tomada de decisão" },
    { icon: TrendingUp, text: "Recomendações de próximas melhorias" },
  ];

  const outcomes = [
    {
      icon: Shield,
      title: "Disciplina Preservada",
      description: "Manter a disciplina de execução ao longo do tempo, sem deixar escapar",
    },
    {
      icon: RefreshCw,
      title: "Sem Regressão",
      description: "Prevenir que a operação volte ao estado anterior de caos",
    },
    {
      icon: Zap,
      title: "Decisões Rápidas",
      description: "Tomar decisões mais rápidas e bem-informadas com suporte externo",
    },
  ];

  const nextSteps = [
    {
      title: "Sprints de Otimização Adicionais",
      description: "Otimizar fluxos específicos que surgirem como gargalos",
    },
    {
      title: "Melhorias Pontuais no Sistema",
      description: "Evoluir o sistema de execução conforme a empresa cresce",
    },
  ];

  const faqs = [
    {
      question: "Por que não posso contratar o retainer direto?",
      answer: "O retainer só faz sentido após um projeto bem-sucedido. Sem valor entregue antes, vira custo fixo sem referência de resultado. A sequência correta é: Diagnóstico → Sprint ou Setup → Retainer.",
    },
    {
      question: "Vocês vão executar o trabalho?",
      answer: "Não. Governamos e orientamos. A execução continua sendo do time. Se precisar de mais mãos, discutimos outro modelo.",
    },
    {
      question: "Qual a frequência de reuniões?",
      answer: "Definimos juntos na contratação. O padrão é uma sessão semanal ou quinzenal de governança, mais check-ins assíncronos conforme necessário.",
    },
    {
      question: "Como evitar virar consultoria infinita?",
      answer: "Escopo claro de governança. Revisamos regularmente se o retainer ainda faz sentido. O objetivo é vocês precisarem menos de nós, não mais.",
    },
    {
      question: "Qual a diferença do Setup de Gestão de Projetos?",
      answer: "O Setup cria o sistema de execução. O Retainer mantém a disciplina e evolui o sistema ao longo do tempo sem deixar virar burocracia.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Retainer de Execução e Governança | BVBP</title>
        <meta
          name="description"
          content="Acompanhamento mensal para manter disciplina de execução, visibilidade e decisões claras. Governança sem burocracia."
        />
      </Helmet>

      <Header />
      <ServiceBreadcrumb currentTitle="Retainer de Governança" />

      <main className="pt-0">
        {/* Hero Section */}
        <section 
          ref={heroRef as React.RefObject<HTMLElement>}
          className={`relative py-16 lg:py-24 bg-gradient-hero overflow-hidden transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <Shield className="w-16 h-16 mx-auto mb-6 text-white" />
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Retainer de Execução e Governança
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-6 max-w-3xl mx-auto leading-relaxed italic">
                "As coisas melhoram quando focamos, mas voltam ao caos quando a atenção vai para outro lugar."
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-white/80 mb-8">
                <span className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Acompanhamento mensal
                </span>
                <span className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Governança
                </span>
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  Disciplina sustentada
                </span>
              </div>
              <p className="text-lg text-white/80 font-medium">
                Disciplina, visibilidade e decisões — sustentadas ao longo do tempo.
              </p>
            </div>
          </div>
        </section>

        {/* Pré-requisito */}
        <section 
          ref={preReqRef as React.RefObject<HTMLElement>}
          className={`py-8 lg:py-10 bg-amber-50 transition-all duration-700 ${preReqVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="container mx-auto px-4">
            <Card className="p-6 border-amber-300 bg-white max-w-3xl mx-auto">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-amber-600 flex-shrink-0" />
                <div>
                  <h3 className="font-heading text-lg font-semibold text-amber-900 mb-2">
                    Este serviço é sempre consequência de valor entregue
                  </h3>
                  <p className="text-amber-800 mb-3">
                    O retainer funciona após um projeto bem-sucedido: Diagnóstico Operacional, Sprint de Otimização ou Setup de Gestão de Projetos.
                  </p>
                  <p className="text-amber-700 text-sm">
                    <strong>A lógica:</strong> O sistema está funcionando. O risco agora não é técnico — é perder disciplina com o tempo. 
                    O retainer existe para garantir que isso não volte ao estado anterior.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Para quem é */}
        <section 
          ref={paraQuemRef as React.RefObject<HTMLElement>}
          className={`py-12 lg:py-16 bg-gray-50 transition-all duration-700 ${paraQuemVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="container mx-auto px-4">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
              Para quem é
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              <Card className="p-6 border-green-200 bg-green-50/50">
                <h3 className="font-heading text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Funciona bem para
                </h3>
                <ul className="space-y-3">
                  {idealFor.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-green-700">
                      <CheckCircle2 className="w-4 h-4 mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
              <Card className="p-6 border-red-200 bg-red-50/50">
                <h3 className="font-heading text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Não é para
                </h3>
                <ul className="space-y-3">
                  {notFor.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-red-700">
                      <XCircle className="w-4 h-4 mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* O que está no escopo */}
        <section 
          ref={escopoRef as React.RefObject<HTMLElement>}
          className={`py-12 lg:py-16 bg-white transition-all duration-700 ${escopoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="container mx-auto px-4">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
              O que está no escopo
            </h2>
            <div className="max-w-3xl mx-auto">
              <ul className="space-y-4 mb-8">
                {scopeItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Card className="p-4 border-primary/30 bg-primary/5">
                <p className="flex items-start gap-2 text-foreground">
                  <Shield className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
                  <span>
                    <strong>Regra clara:</strong> Governamos execução — não tocamos a operação. 
                    A execução continua sendo do time.
                  </span>
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Como funciona */}
        <section 
          ref={comoFuncionaRef as React.RefObject<HTMLElement>}
          className={`py-12 lg:py-16 bg-gray-50 transition-all duration-700 ${comoFuncionaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="container mx-auto px-4">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
              Como funciona
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
              {steps.map((step) => (
                <div key={step.number} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                    {step.number}
                  </div>
                  <step.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <h3 className="font-heading font-semibold text-foreground text-sm mb-1">
                    {step.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Entregáveis + Modelo */}
        <section 
          ref={entregaveisRef as React.RefObject<HTMLElement>}
          className={`py-12 lg:py-16 bg-white transition-all duration-700 ${entregaveisVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="lg:col-span-2">
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-6">
                  O que você recebe
                </h2>
                <ul className="space-y-4">
                  {deliverables.map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <Card className="p-6 bg-primary text-primary-foreground text-center">
                  <RefreshCw className="w-10 h-10 mx-auto mb-3" />
                  <p className="text-sm uppercase tracking-wide mb-1">Modelo</p>
                  <p className="text-3xl font-bold mb-2">Mensal</p>
                  <p className="text-sm opacity-90">
                    Fee fixo ou baseado em horas
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* O que muda */}
        <section 
          ref={resultadoRef as React.RefObject<HTMLElement>}
          className={`py-12 lg:py-16 bg-gray-50 transition-all duration-700 ${resultadoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="container mx-auto px-4">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
              O que muda na prática
            </h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {outcomes.map((outcome, index) => (
                <Card key={index} className="p-6 text-center">
                  <outcome.icon className="w-10 h-10 mx-auto mb-4 text-primary" />
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                    {outcome.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{outcome.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Próximos passos */}
        <section 
          ref={proximosRef as React.RefObject<HTMLElement>}
          className={`py-12 lg:py-16 bg-white transition-all duration-700 ${proximosVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="container mx-auto px-4">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground text-center mb-4">
              O que costuma vir depois
            </h2>
            <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
              O retainer mantém a disciplina — e cria espaço para evoluções pontuais conforme a empresa cresce.
            </p>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {nextSteps.map((step, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-start gap-4">
                    <ArrowRight className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-heading font-semibold text-foreground mb-2">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">{step.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section 
          ref={faqRef as React.RefObject<HTMLElement>}
          className={`py-12 lg:py-16 bg-gray-50 transition-all duration-700 ${faqVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="container mx-auto px-4">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
              Perguntas frequentes
            </h2>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-3">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`} className="bg-white rounded-lg border px-4">
                    <AccordionTrigger className="text-left font-medium hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA + Contact */}
        <section 
          id="contato"
          ref={contatoRef as React.RefObject<HTMLElement>}
          className={`py-12 lg:py-16 bg-white transition-all duration-700 ${contatoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Quer manter a disciplina após um projeto bem-sucedido?
                </h2>
                <p className="text-muted-foreground">
                  Preencha o formulário e conversamos sobre como o retainer pode funcionar para você.
                </p>
              </div>

              <div className="grid lg:grid-cols-5 gap-8">
                {/* Form */}
                <div className="lg:col-span-3">
                  <Card className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">E-mail corporativo *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Telefone</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company">Empresa *</Label>
                          <Input
                            id="company"
                            value={formData.company}
                            onChange={(e) => handleInputChange("company", e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role">Cargo</Label>
                        <Input
                          id="role"
                          value={formData.role}
                          onChange={(e) => handleInputChange("role", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="interest">Interesse</Label>
                        <Select
                          value={formData.interest}
                          onValueChange={(value) => handleInputChange("interest", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Retainer de Execução e Governança">Retainer de Execução e Governança</SelectItem>
                            <SelectItem value="Diagnóstico Operacional">Diagnóstico Operacional</SelectItem>
                            <SelectItem value="Sprint de Otimização de Processo">Sprint de Otimização de Processo</SelectItem>
                            <SelectItem value="Configuração de Gestão e Entrega de Projetos">Configuração de Gestão e Entrega de Projetos</SelectItem>
                            <SelectItem value="Programa Customizado de Melhoria">Programa Customizado de Melhoria</SelectItem>
                            <SelectItem value="Outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="challenge">
                          Qual projeto foi feito recentemente e o que quer manter funcionando?
                        </Label>
                        <Textarea
                          id="challenge"
                          value={formData.challenge}
                          onChange={(e) => handleInputChange("challenge", e.target.value)}
                          rows={3}
                          placeholder="Ex: Fizemos o setup de gestão de projetos há 2 meses e queremos garantir que a disciplina não se perca..."
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full" 
                        variant="corporate"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Enviando..." : "Enviar"}
                      </Button>
                    </form>
                  </Card>
                </div>

                {/* Contact Info */}
                <div className="lg:col-span-2 space-y-6">
                  <Card className="p-6">
                    <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                      <MailIcon className="w-5 h-5 text-primary" />
                      Fale direto conosco
                    </h3>
                    <div className="space-y-3">
                      {emails.map((item, index) => (
                        <a
                          key={index}
                          href={item.link}
                          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                          {item.email}
                        </a>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-6 border-primary/20 bg-primary/5">
                    <h3 className="font-heading font-semibold text-foreground mb-3">
                      Não é delivery
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      O retainer é governança e suporte a decisões. A execução continua sendo do time. 
                      Nosso objetivo é vocês precisarem menos de nós, não mais.
                    </p>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <OtherServicesSection />
      <Footer />
    </>
  );
};

export default RetainerGovernancaPage;
