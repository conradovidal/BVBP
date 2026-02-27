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
import { XCircle, AlertTriangle, FileText, Map, ListChecks, Calendar, ArrowRight, Zap, TrendingUp, Clock, MailIcon, Wrench, CheckCircle, Target, CheckCircle2, Settings, ClipboardCheck, Users } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { submitLead } from "@/lib/submitLead";

import { Link } from "react-router-dom";

const SprintOtimizacaoPage = () => {
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
    interest: "Otimização de Processo",
    challenge: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const result = await submitLead({ formData, source: 'sprint-otimizacao' });
    
    if (result.success) {
      toast({ title: "Recebemos seus dados.", description: "Responderemos em até 4 horas úteis." });
      setFormData({ name: "", email: "", phone: "", company: "", role: "", interest: "Otimização de Processo", challenge: "" });
    } else {
      toast({ title: "Dados inválidos", description: result.errors?.join(", ") || "Verifique os campos.", variant: "destructive" });
    }
    
    setIsSubmitting(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const funcionaBemPara = [
    "Já sabem qual fluxo trava, mas não têm tempo de arrumar",
    "Precisam de um resultado rápido e visível para ganhar tração",
    "Querem reduzir fila, retrabalho ou tempo de ciclo em um processo específico",
    "Buscam resultado prático em poucas semanas",
  ];

  const naoEPara = [
    "Quem ainda não sabe onde está o problema — oferecemos um diagnóstico operacional para identificar os gargalos",
    "Projetos que exigem mudança em vários fluxos ao mesmo tempo",
  ];

  const escopoItems = [
    "1 fluxo operacional por projeto",
    "Diagnóstico rápido do estado atual",
    "Redesenho do processo com acordos e regras",
    "Ajustes implementados e acompanhados",
    "Métricas de antes e depois",
  ];

  const comoFuncionaSteps = [
    { number: 1, title: "Kickoff", description: "Alinhamento e escolha do fluxo", icon: Users },
    { number: 2, title: "Diagnóstico", description: "Mapeamento e gargalos (2-3 dias)", icon: ClipboardCheck },
    { number: 3, title: "Redesenho", description: "Novo processo com acordos", icon: Settings },
    { number: 4, title: "Implementação", description: "Ajustes no jeito de trabalhar", icon: Wrench },
    { number: 5, title: "Validação", description: "Acompanhamento e métricas", icon: TrendingUp },
  ];

  const entregaveis = [
    { icon: Map, text: "Mapa do fluxo otimizado (antes vs. depois)" },
    { icon: ListChecks, text: "Acordos e regras de funcionamento" },
    { icon: Wrench, text: "Ajustes implementados no processo" },
    { icon: TrendingUp, text: "Métricas de fila, tempo de ciclo e retrabalho" },
    { icon: FileText, text: "Documentação do novo processo" },
  ];

  const resultadoBullets = [
    { icon: Zap, title: "Menos Fila", text: "Menos fila e tempo de espera no fluxo otimizado" },
    { icon: Target, title: "Menos Retrabalho", text: "Redução mensurável de retrabalho" },
    { icon: CheckCircle, title: "Processo Claro", text: "Processo claro que o time consegue seguir" },
  ];

  const proximosPassos = [
    { title: "Outra Otimização", description: "Para um segundo fluxo crítico que precisa de atenção", link: null },
    { title: "Configuração de Gestão de Projetos", description: "Estruturar como a empresa toca projetos no geral", link: "/gestao-projetos" },
    { title: "Programa Customizado", description: "Melhoria contínua de múltiplos fluxos ao longo do tempo", link: "/programa-customizado" },
  ];

  const faqs = [
    {
      question: "Qual a diferença do Diagnóstico?",
      answer:
        "O Diagnóstico identifica onde está o problema. A Otimização resolve um fluxo específico com implementação acompanhada.",
    },
    {
      question: "Posso fazer mais de um fluxo por projeto?",
      answer:
        "Não. A regra é 1 fluxo por projeto para garantir profundidade e resultado real.",
    },
    {
      question: "Preciso ter feito o Diagnóstico antes?",
      answer:
        "Não é obrigatório, mas ajuda. Se você já sabe qual fluxo precisa de atenção, podemos começar direto.",
    },
    {
      question: "O que significa 'ajustes implementados'?",
      answer:
        "Significa que não entregamos só o desenho. Acompanhamos a adoção do novo processo e ajustamos conforme necessário.",
    },
    {
      question: "Quanto tempo leva para ver resultado?",
      answer:
        "O projeto dura 2 semanas. Você já consegue medir diferença no final desse período.",
    },
  ];

  const emails = [
    { email: "conrado@bvbp.com.br", link: "mailto:conrado@bvbp.com.br?subject=Otimização%20de%20Processo" },
    { email: "cristiano@bvbp.com.br", link: "mailto:cristiano@bvbp.com.br?subject=Otimização%20de%20Processo" }
  ];

  return (
    <>
      <Helmet>
        <title>Otimização de Processo | BVBP</title>
        <meta
          name="description"
          content="Projeto focado para otimizar 1 fluxo crítico em 2 semanas. Menos fila, menos retrabalho, resultado visível."
        />
      </Helmet>

      <Header />

      <main className="pt-0">
        {/* Seção 1: Hero */}
        <section
          ref={heroRef}
          className={`relative py-16 lg:py-24 bg-gradient-hero overflow-hidden transition-all duration-700 ${
            heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <Zap className="w-16 h-16 mx-auto mb-6 text-white" />
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Otimização de Processo
              </h1>
              
              <p className="text-xl md:text-2xl text-white/90 mb-6 max-w-3xl mx-auto leading-relaxed italic">
                "Sabemos qual fluxo trava, mas não temos tempo de arrumar."
              </p>

              <div className="flex flex-wrap justify-center gap-4 text-white/80 mb-8">
                <span className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  1 fluxo específico
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  2 semanas
                </span>
                <span className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Resultado visível
                </span>
              </div>

              <p className="text-lg text-white/80 font-medium">
                Resultado rápido com implementação acompanhada.
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
                Ideal para quem já identificou o gargalo e precisa de execução focada.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 border-green-200 bg-green-50/50">
                  <h3 className="font-heading text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Funciona bem para
                  </h3>
                  <ul className="space-y-3">
                    {funcionaBemPara.map((item, index) => (
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
                    {naoEPara.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-red-700">
                        <XCircle className="w-4 h-4 mt-1 flex-shrink-0" />
                        <span>{item}</span>
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
                Escopo do Projeto
              </h2>

              <ul className="space-y-4 mb-8">
                {escopoItems.map((item, index) => (
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
                    <strong>Regra:</strong> 1 fluxo por sprint. Sem tentar arrumar a empresa inteira.
                  </span>
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
                {comoFuncionaSteps.map((step) => (
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
                    <p className="text-2xl font-bold mb-2">2 semanas</p>
                    <p className="text-white/80 text-sm">Foco total em 1 fluxo para garantir resultado</p>
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
                    <Card key={index} className="p-6 text-center">
                      <IconComponent className="w-10 h-10 mx-auto mb-4 text-primary" />
                      <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">{item.text}</p>
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
                Após o sprint, você pode continuar otimizando outros fluxos ou estruturar a gestão de projetos.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                {proximosPassos.map((step, index) => {
                  const content = (
                    <div className="flex items-start gap-4">
                      <ArrowRight className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-heading font-semibold text-foreground mb-1">
                          {step.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                        {step.link && (
                          <span className="text-sm text-primary font-medium mt-2 inline-flex items-center gap-1">
                            Ver mais <ArrowRight className="w-4 h-4" />
                          </span>
                        )}
                      </div>
                    </div>
                  );

                  return step.link ? (
                    <Link key={index} to={step.link}>
                      <Card className="p-6 h-full hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
                        {content}
                      </Card>
                    </Link>
                  ) : (
                    <Card key={index} className="p-6">
                      {content}
                    </Card>
                  );
                })}
              </div>
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
                Conte-nos qual fluxo você quer otimizar e entraremos em contato em até 4 horas úteis.
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
                      <Label htmlFor="challenge">Qual fluxo você quer otimizar? *</Label>
                      <Textarea 
                        id="challenge" 
                        value={formData.challenge} 
                        onChange={e => handleInputChange("challenge", e.target.value)} 
                        placeholder="Descreva o fluxo que está travando e o que você espera melhorar..." 
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
              <div>
                <Card className="p-8">
                  <div className="mb-6">
                    <h3 className="font-heading text-2xl font-bold text-bvbp-corporate mb-4">
                      Fale Direto Conosco
                    </h3>
                    <p className="text-muted-foreground">
                      Resposta em até 4 horas úteis
                    </p>
                  </div>

                  <div className="space-y-4">
                    {emails.map((item, index) => (
                      <a 
                        key={index}
                        href={item.link}
                        className="flex items-center space-x-3 text-lg font-medium text-bvbp-corporate hover:text-bvbp-growth transition-colors"
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
        </section>
      </main>

      <Footer />
    </>
  );
};

export default SprintOtimizacaoPage;
