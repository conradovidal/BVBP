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
  FolderKanban,
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
  Layers,
  Calendar,
  Mail,
  MailIcon,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ServiceBreadcrumb, OtherServicesSection } from "@/components/ServiceNavigation";

const GestaoProjetosPage = () => {
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
    interest: "Configuração de Gestão e Entrega de Projetos",
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
        interest: "Configuração de Gestão e Entrega de Projetos",
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
    { email: "conrado@bvbp.com.br", link: "mailto:conrado@bvbp.com.br?subject=Contato%20BVBP%20-%20Gestão%20de%20Projetos" },
    { email: "cristiano@bvbp.com.br", link: "mailto:cristiano@bvbp.com.br?subject=Contato%20BVBP%20-%20Gestão%20de%20Projetos" }
  ];

  const idealFor = [
    "Múltiplos projetos rodando em paralelo",
    "Falta de ownership e priorização claras",
    "Reuniões de status sem visibilidade real",
    "Prazos perdidos ou repriorização constante",
    "Necessidade de um modelo de execução escalável",
  ];

  const notFor = [
    "Times que buscam nova ferramenta sem mudar como decisões são tomadas",
    "Empresas que querem só otimizar um fluxo específico — nesse caso, oferecemos um sprint focado de 2 semanas",
    "Organizações sem disposição para estabelecer cadências",
  ];

  const scopeItems = [
    "Definição de tipos de projeto e regras de intake",
    "Papéis e responsabilidades claros (RACI-light)",
    "Estrutura mínima de board (projetos, fluxo, status)",
    "Cadência de ritos (planning, review, decisão)",
    "Reporting simples para visibilidade da liderança",
  ];

  const steps = [
    { number: 1, title: "Alinhamento", description: "Contexto e avaliação do estado atual", icon: Users },
    { number: 2, title: "Princípios", description: "Definição dos princípios de execução", icon: Target },
    { number: 3, title: "Design", description: "Desenho do sistema de delivery", icon: Settings },
    { number: 4, title: "Setup", description: "Configuração de board e cadência", icon: Layers },
    { number: 5, title: "Validação", description: "Alinhamento com liderança", icon: ClipboardList },
    { number: 6, title: "Handoff", description: "Transferência para o time", icon: Handshake },
  ];

  const deliverables = [
    { icon: FileText, text: "Framework de gestão e delivery de projetos" },
    { icon: Layers, text: "Estrutura de board (tool-agnostic)" },
    { icon: Users, text: "Papéis e responsabilidades definidos" },
    { icon: Calendar, text: "Playbook de cadência e ritos" },
    { icon: BarChart3, text: "Template de reporting para liderança" },
  ];

  const outcomes = [
    {
      icon: Eye,
      title: "Visibilidade Real",
      description: "Saber o status real de todos os projetos ativos a qualquer momento",
    },
    {
      icon: Zap,
      title: "Menos Caos",
      description: "Reduzir o caos causado por repriorização constante",
    },
    {
      icon: Target,
      title: "Decisões Claras",
      description: "Tomar decisões de delivery mais rápidas e fundamentadas",
    },
  ];

  const nextSteps = [
    {
      title: "Retainer de Execução e Governança",
      description: "Acompanhamento contínuo para manter disciplina e evoluir sem virar burocracia",
    },
    {
      title: "Sprints de Otimização Pontuais",
      description: "Otimizar fluxos específicos após o sistema de execução estar funcionando",
    },
  ];

  const faqs = [
    {
      question: "Qual a diferença do Sprint de Otimização?",
      answer: "O Sprint de Otimização resolve um fluxo específico que está travado em 2 semanas. Este serviço cria o sistema de como projetos são tocados na empresa. Um ataca sintomas pontuais, o outro estrutura a execução como um todo.",
    },
    {
      question: "Preciso trocar de ferramenta?",
      answer: "Não. O sistema é tool-agnostic. Adaptamos à ferramenta que vocês já usam (Jira, Asana, Monday, Notion, planilha). A ferramenta é secundária — o que importa é o sistema de decisão.",
    },
    {
      question: "Isso é implementação de Jira/Asana/Monday?",
      answer: "Não. Isso é um sistema de decisão e execução. A ferramenta é só o meio. Muitas empresas têm ferramentas sofisticadas e zero visibilidade. O problema não é a ferramenta.",
    },
    {
      question: "Preciso envolver todo o time?",
      answer: "Não. Trabalhamos com a liderança para definir o sistema. O time é envolvido no handoff final para garantir adoção e tirar dúvidas.",
    },
    {
      question: "E se eu tiver só um fluxo problemático?",
      answer: "Nesse caso, temos um sprint focado de 2 semanas para resolver esse fluxo específico. Este serviço faz sentido quando o problema é sistêmico — muitos projetos, pouca visibilidade, decisões confusas.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Configuração de Gestão e Entrega de Projetos | BVBP</title>
        <meta
          name="description"
          content="Sistema mínimo de execução que traz visibilidade, cadência e clareza nas decisões. 3-4 semanas para saber o status real de todos os projetos."
        />
      </Helmet>

      <Header />
      <ServiceBreadcrumb currentTitle="Gestão de Projetos" />

      <main className="pt-0">
        {/* Hero Section */}
        <section 
          ref={heroRef as React.RefObject<HTMLElement>}
          className={`relative py-16 lg:py-24 bg-gradient-hero overflow-hidden transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <FolderKanban className="w-16 h-16 mx-auto mb-6 text-white" />
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Configuração de Gestão e Entrega de Projetos
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-6 max-w-3xl mx-auto leading-relaxed italic">
                "Temos muitos projetos, mas nenhuma visibilidade clara do que realmente avança."
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-white/80 mb-8">
                <span className="flex items-center gap-2">
                  <FolderKanban className="w-5 h-5" />
                  Sistema de execução
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  3-4 semanas
                </span>
                <span className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Decisões claras
                </span>
              </div>
              <p className="text-lg text-white/80 font-medium">
                Visibilidade, cadência e decisões — sem burocracia.
              </p>
            </div>
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
              <Card className="p-4 border-amber-200 bg-amber-50/50">
                <p className="flex items-start gap-2 text-amber-800">
                  <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Escopo definido:</strong> Otimizamos como projetos são executados, não fluxos individuais. 
                    Para fluxos específicos, o Sprint de Otimização é mais adequado.
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
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

        {/* Entregáveis + Prazo */}
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
                  <Clock className="w-10 h-10 mx-auto mb-3" />
                  <p className="text-sm uppercase tracking-wide mb-1">Prazo</p>
                  <p className="text-3xl font-bold mb-2">3-4 semanas</p>
                  <p className="text-sm opacity-90">
                    Escopo e prazo fixos
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
              O sistema funciona — o desafio agora é manter disciplina e evoluir sem virar burocracia.
            </p>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {nextSteps.map((step, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-start gap-4">
                    <ArrowRight className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
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
              Perguntas Frequentes
            </h2>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-3">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="bg-white rounded-lg border px-4"
                  >
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

        {/* CTA antes do contato */}
        <section className="py-12 lg:py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
              Pronto para ter visibilidade real?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Vamos conversar sobre como estruturar a execução de projetos na sua empresa.
            </p>
            <Button size="lg" onClick={scrollToContact} className="group">
              Falar com especialista
              <Mail className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </section>

        {/* Contato */}
        <section 
          id="contato"
          ref={contatoRef as React.RefObject<HTMLElement>}
          className={`py-12 lg:py-16 bg-gray-50 transition-all duration-700 ${contatoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-4">
                Vamos conversar?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Conte-nos sobre como está a execução de projetos na sua empresa e entraremos em contato em até 4 horas úteis.
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
                      <Label htmlFor="challenge">Maior desafio na execução de projetos? *</Label>
                      <Textarea 
                        id="challenge" 
                        value={formData.challenge} 
                        onChange={e => handleInputChange("challenge", e.target.value)} 
                        placeholder="Conte-nos sobre seus principais desafios na gestão de projetos..." 
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

      <OtherServicesSection />
      <Footer />
    </>
  );
};

export default GestaoProjetosPage;
