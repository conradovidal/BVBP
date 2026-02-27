import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { submitLead } from "@/lib/submitLead";
import { 
  Search, 
  Zap, 
  FolderKanban, 
  RefreshCw, 
  Settings, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Target,
  HelpCircle,
  MailIcon
} from "lucide-react";

const services = [
  {
    slug: "diagnostico-operacional",
    title: "Diagnóstico Operacional",
    shortTitle: "Diagnóstico",
    duration: "1 semana",
    icon: Search,
    focus: "Clareza",
    when: "Não sabe por onde começar",
    prerequisite: "Nenhum",
    result: "Plano de ação",
    idealFor: "Não sabe por onde começar",
    tagline: "Clareza antes de agir",
    color: "bg-blue-500",
  },
  {
    slug: "sprint-otimizacao",
    title: "Otimização de Processo",
    shortTitle: "Otimização",
    duration: "2 semanas",
    icon: Zap,
    focus: "Resultado rápido",
    when: "Sabe o gargalo, quer resolver rápido",
    prerequisite: "Diagnóstico recomendado",
    result: "Processo otimizado",
    idealFor: "Resolver 1 problema",
    tagline: "Resultado rápido em 2 semanas",
    color: "bg-yellow-500",
  },
  {
    slug: "gestao-projetos",
    title: "Gestão de Projetos",
    shortTitle: "Gestão",
    duration: "3-4 semanas",
    icon: FolderKanban,
    focus: "Sistema de gestão",
    when: "Projetos desorganizados",
    prerequisite: "Nenhum",
    result: "Previsibilidade e papéis claros",
    idealFor: "Organizar execução",
    tagline: "Estrutura para tocar projetos",
    color: "bg-purple-500",
  },
  {
    slug: "retainer-governanca",
    title: "Implementação de Governança de Execução",
    shortTitle: "Governança",
    duration: "Mensal",
    icon: RefreshCw,
    focus: "Governança contínua",
    when: "Após melhoria, manter disciplina",
    prerequisite: "Projeto anterior",
    result: "Disciplina sustentada",
    idealFor: "Não regredir",
    tagline: "Manter o que funciona",
    color: "bg-green-500",
  },
  {
    slug: "programa-customizado",
    title: "Programa Customizado",
    shortTitle: "Programa",
    duration: "6-12 semanas",
    icon: Settings,
    focus: "Transformação estruturada",
    when: "Múltiplos fluxos críticos",
    prerequisite: "Diagnóstico obrigatório",
    result: "2-3 fluxos + governança",
    idealFor: "Pensar no longo prazo",
    tagline: "Transformação completa",
    color: "bg-red-500",
  },
];

type QuizAnswer = "clarity" | "single" | "multiple" | "maintain" | "projects";

const ComparativoServicosPage = () => {
  const { toast } = useToast();
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: tableRef, isVisible: tableVisible } = useScrollAnimation();
  const { ref: quizRef, isVisible: quizVisible } = useScrollAnimation();
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation();
  const { ref: faqRef, isVisible: faqVisible } = useScrollAnimation();
  const { ref: contatoRef, isVisible: contatoVisible } = useScrollAnimation();

  // Quiz state
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer[]>([]);
  const [quizResult, setQuizResult] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    interest: "",
    challenge: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const result = await submitLead({ formData, source: 'comparativo-servicos' });
    
    if (result.success) {
      toast({ title: "Recebemos seus dados.", description: "Responderemos em até 4 horas úteis." });
      setFormData({ name: "", email: "", phone: "", company: "", role: "", interest: "", challenge: "" });
    } else {
      toast({ title: "Dados inválidos", description: result.errors?.join(", ") || "Verifique os campos.", variant: "destructive" });
    }
    
    setIsSubmitting(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const scrollToContato = () => {
    document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" });
  };

  // Quiz logic
  const quizQuestions = [
    {
      question: "Você sabe qual é o principal gargalo da operação?",
      options: [
        { label: "Não, preciso de clareza", value: "clarity" as QuizAnswer },
        { label: "Sim, quero resolver rápido", value: "single" as QuizAnswer },
        { label: "Tenho vários problemas para resolver", value: "multiple" as QuizAnswer },
      ],
    },
    {
      question: "Qual seu objetivo principal agora?",
      options: [
        { label: "Entender onde estou perdendo", value: "clarity" as QuizAnswer },
        { label: "Resolver 1 problema específico", value: "single" as QuizAnswer },
        { label: "Organizar como tocamos projetos", value: "projects" as QuizAnswer },
        { label: "Manter resultados ao longo do tempo", value: "maintain" as QuizAnswer },
      ],
    },
  ];

  const handleQuizAnswer = (answer: QuizAnswer) => {
    const newAnswers = [...quizAnswers, answer];
    setQuizAnswers(newAnswers);

    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      // Calculate result
      const hasClarity = newAnswers.includes("clarity");
      const hasSingle = newAnswers.includes("single");
      const hasMultiple = newAnswers.includes("multiple");
      const hasMaintain = newAnswers.includes("maintain");
      const hasProjects = newAnswers.includes("projects");

      if (hasClarity && !hasMultiple && !hasSingle) {
        setQuizResult("diagnostico-operacional");
      } else if (hasMaintain) {
        setQuizResult("retainer-governanca");
      } else if (hasProjects) {
        setQuizResult("gestao-projetos");
      } else if (hasMultiple) {
        setQuizResult("programa-customizado");
      } else if (hasSingle) {
        setQuizResult("sprint-otimizacao");
      } else {
        setQuizResult("diagnostico-operacional");
      }
    }
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers([]);
    setQuizResult(null);
  };

  const getRecommendedService = () => {
    return services.find(s => s.slug === quizResult);
  };

  const faqs = [
    {
      question: "Por onde devo começar?",
      answer: "Se não tem clareza do problema, comece pelo Diagnóstico. Se já sabe o gargalo, vá direto para Otimização ou Gestão de Projetos.",
    },
    {
      question: "Posso contratar a Governança de Execução direto?",
      answer: "A Implementação de Governança é sempre consequência de valor entregue. Funciona melhor após um Diagnóstico, Otimização ou Setup bem-sucedido.",
    },
    {
      question: "Qual a diferença entre Otimização e Programa?",
      answer: "A Otimização resolve 1 fluxo em 2 semanas. O Programa aborda 2-3 fluxos e inclui governança para sustentar os resultados.",
    },
    {
      question: "Preciso fazer o Diagnóstico antes de tudo?",
      answer: "Recomendamos, mas não é obrigatório. Se você já tem clareza do gargalo, pode ir direto para a Otimização ou Gestão.",
    },
    {
      question: "E se eu não souber o que preciso?",
      answer: "Agende uma conversa. Em 30 minutos ajudamos a entender sua situação e recomendar o melhor caminho sem compromisso.",
    },
  ];

  const comparisonCriteria = [
    { label: "Duração", key: "duration" as const },
    { label: "Foco", key: "focus" as const },
    { label: "Quando usar", key: "when" as const },
    { label: "Pré-requisito", key: "prerequisite" as const },
    { label: "Resultado", key: "result" as const },
    { label: "Ideal para", key: "idealFor" as const },
  ];

  return (
    <>
      <Helmet>
        <title>Comparativo de Serviços | Qual é o certo para você? | BVBP</title>
        <meta
          name="description"
          content="Compare os serviços da BVBP e descubra qual é o mais adequado para sua situação. Diagnóstico, Sprint, Gestão de Projetos, Governança ou Programa Customizado."
        />
      </Helmet>

      <Header />

      <main className="pt-20">
        {/* Hero */}
        <section
          ref={heroRef}
          className={`relative py-16 lg:py-24 bg-gradient-hero overflow-hidden transition-all duration-700 ${
            heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <HelpCircle className="w-16 h-16 mx-auto mb-6 text-white" />
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Qual serviço é o certo para você?
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Compare os serviços, faça o quiz ou fale com a gente. Vamos encontrar o melhor caminho juntos.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={() => document.getElementById("quiz")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Fazer o Quiz
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-bvbp-corporate"
                  onClick={() => document.getElementById("tabela")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Ver Comparativo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section
          id="tabela"
          ref={tableRef}
          className={`py-12 lg:py-16 bg-gray-50 transition-all duration-700 ${
            tableVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-8 text-center">
                Comparativo dos Serviços
              </h2>

              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full bg-white rounded-lg shadow-soft overflow-hidden">
                  <thead>
                    <tr className="bg-bvbp-corporate text-white">
                      <th className="p-4 text-left font-heading">Critério</th>
                      {services.map((service) => (
                        <th key={service.slug} className="p-4 text-center font-heading">
                          <div className="flex flex-col items-center gap-2">
                            <service.icon className="w-6 h-6" />
                            <span className="text-sm">{service.shortTitle}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonCriteria.map((criteria, index) => (
                      <tr key={criteria.key} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="p-4 font-medium text-foreground">{criteria.label}</td>
                        {services.map((service) => (
                          <td key={service.slug} className="p-4 text-center text-muted-foreground text-sm">
                            {service[criteria.key]}
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr className="bg-bvbp-growth-light">
                      <td className="p-4 font-medium text-foreground">Ação</td>
                      {services.map((service) => (
                        <td key={service.slug} className="p-4 text-center">
                          <Link to={`/${service.slug}`}>
                            <Button size="sm" variant="outline" className="text-xs">
                              Ver mais
                            </Button>
                          </Link>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4">
                {services.map((service) => (
                  <Card key={service.slug} className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-full ${service.color} flex items-center justify-center`}>
                        <service.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-foreground">{service.shortTitle}</h3>
                        <p className="text-xs text-muted-foreground">{service.duration}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      {comparisonCriteria.slice(1).map((criteria) => (
                        <div key={criteria.key} className="flex justify-between">
                          <span className="text-muted-foreground">{criteria.label}:</span>
                          <span className="text-foreground font-medium">{service[criteria.key]}</span>
                        </div>
                      ))}
                    </div>
                    <Link to={`/${service.slug}`} className="block mt-4">
                      <Button size="sm" variant="outline" className="w-full">
                        Ver detalhes
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Quiz Section */}
        <section
          id="quiz"
          ref={quizRef}
          className={`py-12 lg:py-16 bg-white transition-all duration-700 ${
            quizVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-4 text-center">
                Descubra seu serviço
              </h2>
              <p className="text-muted-foreground text-center mb-8">
                Responda 2 perguntas rápidas e descubra qual serviço é mais adequado para você.
              </p>

              <Card className="p-6 md:p-8">
                {quizResult === null ? (
                  <>
                    {/* Progress */}
                    <div className="flex gap-2 mb-6">
                      {quizQuestions.map((_, index) => (
                        <div
                          key={index}
                          className={`h-2 flex-1 rounded-full ${
                            index <= quizStep ? "bg-primary" : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Question */}
                    <h3 className="font-heading text-xl font-semibold text-foreground mb-6">
                      {quizQuestions[quizStep].question}
                    </h3>

                    {/* Options */}
                    <div className="space-y-3">
                      {quizQuestions[quizStep].options.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleQuizAnswer(option.value)}
                          className="w-full p-4 text-left border rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Result */}
                    <div className="text-center">
                      <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-primary" />
                      <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                        Serviço recomendado:
                      </h3>
                      {getRecommendedService() && (
                        <>
                          <div className="flex items-center justify-center gap-3 mb-4">
                            {(() => {
                              const service = getRecommendedService()!;
                              const Icon = service.icon;
                              return (
                                <>
                                  <div className={`w-12 h-12 rounded-full ${service.color} flex items-center justify-center`}>
                                    <Icon className="w-6 h-6 text-white" />
                                  </div>
                                  <div className="text-left">
                                    <p className="font-heading text-lg font-bold text-foreground">
                                      {service.title}
                                    </p>
                                    <p className="text-sm text-muted-foreground">{service.tagline}</p>
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                          <p className="text-muted-foreground mb-6">
                            Duração: {getRecommendedService()!.duration}
                          </p>
                          <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link to={`/${quizResult}`}>
                              <Button>
                                Ver detalhes
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Button>
                            </Link>
                            <Button variant="outline" onClick={resetQuiz}>
                              Refazer quiz
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}
              </Card>
            </div>
          </div>
        </section>

        {/* Service Cards */}
        <section
          ref={cardsRef}
          className={`py-12 lg:py-16 bg-gray-50 transition-all duration-700 ${
            cardsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-8 text-center">
                Todos os Serviços
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <Link key={service.slug} to={`/${service.slug}`}>
                    <Card className="p-6 h-full hover:border-primary/50 hover:shadow-md transition-all group cursor-pointer">
                      <div className={`w-12 h-12 rounded-full ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <service.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{service.duration}</span>
                      </div>
                      <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">{service.tagline}</p>
                      <div className="flex items-center text-primary text-sm">
                        <span>Ver detalhes</span>
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section
          ref={faqRef}
          className={`py-12 lg:py-16 bg-white transition-all duration-700 ${
            faqVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-8 text-center">
                Perguntas Frequentes
              </h2>

              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-heading">
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

        {/* Contact CTA */}
        <section
          id="contato"
          ref={contatoRef}
          className={`py-12 lg:py-16 bg-gray-50 transition-all duration-700 ${
            contatoVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                {/* Left - CTA Text */}
                <div>
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-4">
                    Ainda não tem certeza?
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Agende uma conversa de 30 minutos. Vamos entender sua situação e recomendar o melhor caminho — sem compromisso.
                  </p>
                  <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MailIcon className="w-4 h-4" />
                      <a href="mailto:conrado@bvbp.com.br" className="hover:text-primary transition-colors">
                        conrado@bvbp.com.br
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <MailIcon className="w-4 h-4" />
                      <a href="mailto:cristiano@bvbp.com.br" className="hover:text-primary transition-colors">
                        cristiano@bvbp.com.br
                      </a>
                    </div>
                  </div>
                </div>

                {/* Right - Form */}
                <Card className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
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
                        <Label htmlFor="email">E-mail *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company">Empresa *</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => handleInputChange("company", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="interest">Interesse</Label>
                        <Select value={formData.interest} onValueChange={(value) => handleInputChange("interest", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            {services.map((service) => (
                              <SelectItem key={service.slug} value={service.title}>
                                {service.title}
                              </SelectItem>
                            ))}
                            <SelectItem value="Não sei ainda">Não sei ainda</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="challenge">Qual seu principal desafio?</Label>
                      <Textarea
                        id="challenge"
                        value={formData.challenge}
                        onChange={(e) => handleInputChange("challenge", e.target.value)}
                        rows={3}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Enviando..." : "Falar com especialista"}
                    </Button>
                  </form>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ComparativoServicosPage;
