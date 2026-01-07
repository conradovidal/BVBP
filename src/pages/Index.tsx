import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TextRotate } from "@/components/ui/text-rotate";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Target, Users, Zap, TrendingUp, Search, Sparkles, Check, Settings, Lightbulb, LinkedinIcon, Heart, Award, Clock, ArrowRight, Wrench, Rocket, Star, Crown, MailIcon, PhoneIcon, MapPinIcon, ClockIcon, MessageCircleIcon } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
const Index = () => {
  const {
    toast
  } = useToast();

  // Scroll animations for each section
  const {
    ref: heroRef,
    isVisible: heroVisible
  } = useScrollAnimation(0.1);
  const {
    ref: problemRef,
    isVisible: problemVisible
  } = useScrollAnimation(0.1);
  const {
    ref: differentialRef,
    isVisible: differentialVisible
  } = useScrollAnimation(0.1);
  const {
    ref: aboutRef,
    isVisible: aboutVisible
  } = useScrollAnimation(0.1);
  const {
    ref: servicesRef,
    isVisible: servicesVisible
  } = useScrollAnimation(0.1);
  const {
    ref: storyRef,
    isVisible: storyVisible
  } = useScrollAnimation(0.1);
  const {
    ref: contactRef,
    isVisible: contactVisible
  } = useScrollAnimation(0.1);
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
        interest: "",
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
  const team = [{
    name: "Cristiano Basso",
    role: "",
    bio: "10+ anos ajudando empresas a parar de perder dinheiro com retrabalho. Especialista em organizar processos confusos e dar autonomia para o time.",
    linkedin: "https://www.linkedin.com/in/cristianobasso/",
    photo: "/lovable-uploads/5308fe52-0ff8-4f9d-8040-99ff6ff89d35.png"
  }, {
    name: "Conrado Vidal",
    role: "",
    bio: "9+ anos transformando operação caótica em processos claros. Especialista em fazer o time ganhar foco e o líder parar de apagar incêndio.",
    linkedin: "https://www.linkedin.com/in/conradovidal/",
    photo: "/lovable-uploads/c237e246-d750-44a5-96a1-510e298e84ed.png"
  }];
  const values = [{
    icon: Target,
    title: "Orientação a Resultado",
    description: "Não vendemos PowerPoint. Mostramos onde você perde dinheiro e ajudamos a parar a sangria."
  }, {
    icon: Heart,
    title: "Honestidade",
    description: "Se não conseguirmos ajudar, falamos na lata. Só trabalhamos onde vemos chance real de cortar retrabalho."
  }, {
    icon: Award,
    title: "Qualidade",
    description: "Entregamos processos claros e sustentáveis. Seu time ganha autonomia, não dependência."
  }];
  const services = [{
    title: "Diagnóstico Operacional",
    duration: "1 semana",
    icon: Search,
    description: "Mapeamos onde o fluxo trava, onde o retrabalho aparece e quais são os próximos passos mais efetivos.",
    features: ["Conversa com o líder para entender contexto e objetivo", "Mapeamento de 1 fluxo crítico de ponta a ponta", "Baseline simples, filas, retrabalho e pontos de decisão", "Plano de 2 semanas com prioridades e sequência sugerida"],
    details: ["2 a 3 encontros ao longo da semana", "Sem necessidade de envolver toda a equipe", "Entrega objetiva, sem burocracia"],
    cta: "Quero mapear meu gargalo",
    link: "/diagnostico-operacional"
  }, {
    title: "Sprint de Otimização de Processo",
    duration: "2 semanas",
    icon: Zap,
    description: "Escolhemos 1 fluxo e fazemos um quick win real. Menos fila, menos retrabalho, mais clareza do que está em andamento.",
    features: ["Diagnóstico rápido do fluxo e seus gargalos", "Redesenho do processo com acordos e regras simples", "Ajustes no jeito de trabalhar, entrada, saída, prioridade", "Validação e acompanhamento da implementação"],
    details: ["1 fluxo por sprint, sem tentar arrumar a empresa", "Foco em reduzir fila e retrabalho", "Resultado visível em pouco tempo"],
    cta: "Quero destravar um fluxo",
    link: "/sprint-otimizacao"
  }, {
    title: "Configuração de Gestão e Entrega de Projetos",
    duration: "3-4 semanas",
    icon: Settings,
    description: "Criamos o sistema mínimo para tocar projetos com cadência, papéis claros e reporting que vira decisão.",
    features: ["Board mínimo e padrão de organização de projetos", "Cadência de ritos, alinhamentos e checkpoints", "Definição de papéis, responsabilidades e acordos", "Modelo de reporte simples para dar visibilidade"],
    details: ["Adaptado à ferramenta que vocês já usam", "Menos status, mais clareza e decisão", "Pronto para escalar com o time"],
    cta: "Quero organizar meus projetos",
    link: "/gestao-projetos"
  }, {
    title: "Retainer de Execução e Governança",
    duration: "Mensal",
    icon: TrendingUp,
    description: "Acompanhamento contínuo para manter disciplina de execução, visibilidade e decisões — sem virar burocracia.",
    features: ["Check-ins regulares de execução e governança", "Revisão de prioridades, progresso e bloqueios", "Suporte a decisões da liderança", "Advisory sobre riscos de execução"],
    details: ["Após projeto bem-sucedido (Diagnóstico, Sprint ou Setup)", "Governança, não execução — o time continua tocando", "Objetivo: vocês precisarem menos de nós"],
    cta: "Quero manter a disciplina",
    link: "/retainer-governanca"
  }, {
    title: "Programa Customizado de Melhoria",
    duration: "6 a 12 semanas",
    icon: Crown,
    description: "Para quando precisa ir além do quick win. Melhoramos 2 a 3 fluxos críticos e deixamos governança mínima para sustentar.",
    features: ["Plano por ondas com escopo e sequência de execução", "Otimização de 2 a 3 fluxos críticos", "Implementação acompanhada para garantir adoção", "Capacitação do time para manter depois"],
    details: ["Entrada via Diagnóstico Operacional", "Escopo controlado, sem virar infinito", "Foco em resultado prático e sustentação"],
    cta: "Quero um plano sob medida",
    link: "/programa-customizado"
  }];
  const emails = [
    { email: "conrado@bvbp.com.br", link: "mailto:conrado@bvbp.com.br?subject=Contato%20BVBP" },
    { email: "cristiano@bvbp.com.br", link: "mailto:cristiano@bvbp.com.br?subject=Contato%20BVBP" }
  ];
  const benefits = ["Diagnóstico gratuito", "Resposta em até 4 horas úteis", "Sem compromisso", "Mostramos onde você está perdendo dinheiro"];
  return <>
      <Helmet>
        <title>BVBP - Pare de perder dinheiro com retrabalho e processos confusos</title>
        <meta name="description" content="Organizamos seus processos para que seu time ganhe foco e você volte a ter tempo para pensar no negócio, não só na operação." />
      </Helmet>

      <div className="min-h-screen">
        <Header />
        <main>
          {/* Hero Section */}
          <section id="inicio" ref={heroRef as React.RefObject<HTMLElement>} className={`relative py-20 lg:py-32 bg-gradient-hero overflow-hidden transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="absolute inset-0 bg-black/5"></div>
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-5xl mx-auto text-center space-y-12">
                <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-relaxed">
                  <span className="block animate-fade-in">Você está deixando</span>
                  <span className="block text-bvbp-growth font-bold animate-fade-in [animation-delay:150ms] opacity-0 [animation-fill-mode:forwards]">dinheiro na mesa</span>
                  <span className="block animate-fade-in [animation-delay:300ms] opacity-0 [animation-fill-mode:forwards]">todo mês devido a</span>
                  <span className="block text-bvbp-growth font-bold animate-fade-in [animation-delay:450ms] opacity-0 [animation-fill-mode:forwards] pb-2">
                    <TextRotate
                      texts={[
                        "planejamentos mal feitos",
                        "processos ineficientes",
                        "priorizações confusas",
                        "gestão desorganizada",
                        "comunicação falha",
                        "operação bagunçada",
                        "alinhamento superficial"
                      ]}
                      rotationInterval={2500}
                      splitBy="none"
                      mainClassName="inline-flex justify-center"
                      elementLevelClassName="inline-block"
                    />
                  </span>
                </h1>

                

                <div className="pt-8 animate-fade-in [animation-delay:400ms] flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <Button variant="success" size="xl" className="group shadow-strong bg-bvbp-growth hover:bg-bvbp-growth/90 text-white font-bold px-8 py-4 text-lg hover:scale-105 transform transition-bounce pulse" onClick={() => document.getElementById('contato')?.scrollIntoView({
                  behavior: 'smooth'
                })}>
                    Quero parar de perder dinheiro
                  </Button>
                  <Button variant="outline-hero" size="xl" onClick={() => window.location.href = '/calculadora-roi'} className="hover:scale-105 transition-transform shadow-soft bg-white/10 hover:bg-white/20 text-white border-white/30">
                    Calculadora ROI
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Problem Section */}
          <section ref={problemRef as React.RefObject<HTMLElement>} className={`py-20 bg-gray-50 relative transition-all duration-700 ${problemVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-warning"></div>
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-warning mb-8 shadow-warning">
                    <Search className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="font-heading text-3xl md:text-5xl font-bold text-bvbp-corporate mb-6">
                    Reconhece estes problemas?
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    A gente sabe como é frustrante ver o time se esforçar e, mesmo assim, as coisas não andarem.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {[{
                  title: "Você passa o dia apagando incêndio",
                  description: "Sem tempo para o negócio"
                }, {
                  title: "Reuniões que não levam a nada",
                  description: "Horas perdidas sem resultado"
                }, {
                  title: "Operação travando o crescimento",
                  description: "A receita sobe, a eficiência despenca"
                }, {
                  title: "Dinheiro jogado fora com retrabalho",
                  description: "Processos confusos geram desperdício"
                }].map((problem, index) => <div key={index} className="group p-6 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-gray-100 hover:border-bvbp-growth hover:shadow-strong transition-all duration-500 hover:-translate-y-2">
                      <div className="flex items-start space-x-4">
                        <div className="relative inline-flex items-center justify-center w-12 h-12 aspect-square rounded-full border-2 border-gray-200 bg-gray-100 group-hover:bg-bvbp-growth group-hover:border-bvbp-growth transition-all duration-300">
                          <Check className="h-6 w-6 text-gray-400 group-hover:text-white transition-all duration-300" />
                        </div>
                        <div>
                          <h3 className="font-heading font-bold text-xl text-bvbp-corporate mb-3 group-hover:text-bvbp-growth transition-colors duration-300">
                            {problem.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {problem.description}
                          </p>
                        </div>
                      </div>
                    </div>)}
                </div>

                <div className="text-center mt-16">
                  <Card className="p-8 bg-white border-0 shadow-soft">
                    <h3 className="font-heading text-2xl font-bold text-bvbp-corporate mb-4">O custo real disso</h3>
                    <p className="text-lg text-foreground leading-relaxed mb-6">
                      Empresas médias perdem em média 20-30% de receita com retrabalho e processos confusos.
                    </p>
                    <Button variant="success" size="lg" className="bg-bvbp-growth hover:bg-bvbp-growth/90" onClick={() => document.getElementById('contato')?.scrollIntoView({
                    behavior: 'smooth'
                  })}>
                      Quero parar de perder dinheiro agora
                    </Button>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Differentiation Section */}
          <section ref={differentialRef as React.RefObject<HTMLElement>} className={`py-20 bg-white relative transition-all duration-700 ${differentialVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-success"></div>
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-bvbp-growth mb-8 shadow-success">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="font-heading text-3xl md:text-5xl font-bold text-bvbp-corporate mb-6">
                    Como a BVBP resolve isso
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    A BVBP organiza seus processos e monta um jeito claro de trabalhar que todo mundo segue.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[{
                  icon: Search,
                  title: "Diagnóstico Claro",
                  description: "Mostramos exatamente onde você perde dinheiro com retrabalho."
                }, {
                  icon: Target,
                  title: "Processos na Medida",
                  description: "Não empurramos método pronto. Criamos o jeito de trabalhar que funciona para você."
                }, {
                  icon: Zap,
                  title: "Execução Lado a Lado",
                  description: "Não entregamos PowerPoint. Colocamos a mão na massa junto com seu time."
                }, {
                  icon: Lightbulb,
                  title: "Autonomia em 90 dias",
                  description: "Seu time ganha foco e autonomia, e você para de viver apagando incêndio."
                }].map((diff, index) => <div key={index} className="group text-center p-8 hover:shadow-strong transition-all duration-500 hover:-translate-y-2 border-0 bg-gradient-subtle relative overflow-hidden rounded-lg">
                      <div className="absolute inset-0 bg-gradient-success opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                      <div className="relative z-10">
                        <div className="w-20 h-20 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-soft">
                          <diff.icon className="h-10 w-10 text-white" />
                        </div>
                        <h3 className="font-heading font-bold text-xl text-bvbp-corporate mb-4 group-hover:text-bvbp-growth transition-colors duration-300">
                          {diff.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {diff.description}
                        </p>
                      </div>
                    </div>)}
                </div>
              </div>
            </div>
          </section>

          {/* Serviços Section */}
          <section id="servicos" ref={servicesRef as React.RefObject<HTMLElement>} className={`py-20 bg-gray-50 transition-all duration-700 ${servicesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="font-heading text-3xl md:text-5xl font-bold text-bvbp-corporate mb-6">
                  Serviços
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Ofertas enxutas para tirar gargalos do caminho e dar previsibilidade para a operação.
                </p>
              </div>

              <div className="space-y-8 max-w-7xl mx-auto">
                {/* First row - 3 cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {services.slice(0, 3).map((service, index) => {
                  const IconComponent = service.icon;
                  return <Card key={index} className="group relative p-6 md:p-8 h-full flex flex-col shadow-soft hover:shadow-strong transition-all duration-500 hover:-translate-y-2 border border-gray-100 bg-white overflow-hidden rounded-xl">
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-success opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                        
                        {/* Header */}
                        <div className="relative text-center mb-6">
                          <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full mb-4 bg-gradient-hero shadow-soft group-hover:scale-110 transition-transform duration-300">
                            <IconComponent className="h-6 w-6 md:h-8 md:w-8 text-white" />
                          </div>

                          <h3 className="font-heading text-xl md:text-2xl font-bold text-bvbp-corporate mb-2 group-hover:text-bvbp-growth transition-colors duration-300">
                            {service.title}
                          </h3>

                          <div className="flex items-center justify-center mb-4">
                            <div className="text-sm text-muted-foreground">
                              <Clock className="h-4 w-4 inline mr-1" />
                              {service.duration}
                            </div>
                          </div>

                          <p className="text-muted-foreground">
                            {service.description}
                          </p>
                        </div>

                        {/* Features */}
                        <div className="relative space-y-3 mb-6 flex-1">
                          <h4 className="font-semibold text-bvbp-corporate">O que está incluído:</h4>
                          {service.features.map((feature, featureIndex) => <div key={featureIndex} className="flex items-start space-x-2">
                              <CheckCircle className="h-4 w-4 text-bvbp-growth mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-foreground">{feature}</span>
                            </div>)}
                        </div>

                        {/* Details */}
                        <div className="relative bg-muted/30 p-4 rounded-lg mb-6">
                          <h4 className="font-semibold text-bvbp-corporate mb-2">Detalhes:</h4>
                          <div className="space-y-1">
                            {service.details.map((detail, detailIndex) => <div key={detailIndex} className="text-sm text-muted-foreground">
                                • {detail}
                              </div>)}
                          </div>
                        </div>

                        {/* CTA */}
                        <Button variant="hero" className="relative w-full px-4 py-2 text-center" size="lg" onClick={() => {
                          if (service.link) {
                            window.location.href = service.link;
                          } else {
                            document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}>
                          {service.cta}
                        </Button>
                      </Card>;
                })}
                </div>

                {/* Second row - 2 cards centered */}
                <div className="grid md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
                  {services.slice(3, 5).map((service, index) => {
                  const IconComponent = service.icon;
                  return <Card key={index + 3} className="group relative p-6 md:p-8 h-full flex flex-col shadow-soft hover:shadow-strong transition-all duration-500 hover:-translate-y-2 border border-gray-100 bg-white overflow-hidden rounded-xl">
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-success opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                        
                        {/* Header */}
                        <div className="relative text-center mb-6">
                          <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full mb-4 bg-gradient-hero shadow-soft group-hover:scale-110 transition-transform duration-300">
                            <IconComponent className="h-6 w-6 md:h-8 md:w-8 text-white" />
                          </div>

                          <h3 className="font-heading text-xl md:text-2xl font-bold text-bvbp-corporate mb-2 group-hover:text-bvbp-growth transition-colors duration-300">
                            {service.title}
                          </h3>

                          <div className="flex items-center justify-center mb-4">
                            <div className="text-sm text-muted-foreground">
                              <Clock className="h-4 w-4 inline mr-1" />
                              {service.duration}
                            </div>
                          </div>

                          <p className="text-muted-foreground">
                            {service.description}
                          </p>
                        </div>

                        {/* Features */}
                        <div className="relative space-y-3 mb-6 flex-1">
                          <h4 className="font-semibold text-bvbp-corporate">O que está incluído:</h4>
                          {service.features.map((feature, featureIndex) => <div key={featureIndex} className="flex items-start space-x-2">
                              <CheckCircle className="h-4 w-4 text-bvbp-growth mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-foreground">{feature}</span>
                            </div>)}
                        </div>

                        {/* Details */}
                        <div className="relative bg-muted/30 p-4 rounded-lg mb-6">
                          <h4 className="font-semibold text-bvbp-corporate mb-2">Detalhes:</h4>
                          <div className="space-y-1">
                            {service.details.map((detail, detailIndex) => <div key={detailIndex} className="text-sm text-muted-foreground">
                                • {detail}
                              </div>)}
                          </div>
                        </div>

                        {/* CTA */}
                        <Button variant="hero" className="relative w-full px-4 py-2 text-center" size="lg" onClick={() => {
                          if (service.link) {
                            window.location.href = service.link;
                          } else {
                            document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}>
                          {service.cta}
                        </Button>
                      </Card>;
                })}
                </div>

                {/* Garantia de ROI */}
                
              </div>
            </div>
          </section>

          {/* Authority & Story Section */}
          

          {/* Quem Somos Section */}
          <section id="quem-somos" ref={aboutRef as React.RefObject<HTMLElement>} className={`py-20 bg-gray-50 transition-all duration-700 ${aboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="container mx-auto px-4">
              {/* Nossa Missão - Minimalista com tipografia forte */}
              <div className="max-w-4xl mx-auto mb-16">
                <h2 className="font-heading text-2xl md:text-4xl lg:text-5xl font-bold text-bvbp-corporate leading-snug text-center mb-8 max-w-5xl mx-auto text-balance">
                  Você volta a ter tempo para pensar no <span className="text-bvbp-growth inline-block animate-pulse-subtle hover:scale-110 transition-transform duration-300">negócio</span>, não só na operação.
                </h2>
                <Card className="bg-white border-gray-200 shadow-soft hover:shadow-strong transition-all duration-300">
                  <CardContent className="p-8">
                    <p className="text-muted-foreground leading-relaxed text-center">
                      A BVBP organiza seus processos e monta um jeito claro de trabalhar que todo mundo segue. Não criamos dependência, criamos autonomia.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Nosso Time - Grid 2 colunas, cards verticais */}
              <div className="max-w-6xl mx-auto mb-20">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-hero mb-6 shadow-soft">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-heading text-2xl md:text-3xl font-bold text-bvbp-corporate mb-4">
                    Nosso Time
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {team.map((member, index) => <Card key={index} className="group p-8 text-center hover:shadow-strong transition-all duration-500 hover:-translate-y-2 bg-white">
                      <img src={member.photo} alt={member.name} className="w-48 h-48 rounded-xl object-cover mx-auto mb-6 shadow-soft group-hover:shadow-strong transition-all duration-300" />
                      <h3 className="font-heading font-bold text-xl text-bvbp-corporate mb-2">
                        {member.name}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {member.bio}
                      </p>
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-bvbp-growth hover:text-bvbp-growth/80 transition-colors font-medium">
                        <LinkedinIcon className="h-5 w-5" />
                        <span>LinkedIn</span>
                      </a>
                    </Card>)}
                </div>
              </div>

              {/* Values */}
              <div>
                <div className="text-center mb-16">
                  <h2 className="font-heading text-3xl md:text-5xl font-bold text-bvbp-corporate mb-6">
                    Nossos Valores
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Os princípios que guiam cada decisão e ação
                  </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  {values.map((value, index) => {
                  const IconComponent = value.icon;
                  return <Card key={index} className="group p-8 text-center hover:shadow-strong transition-all duration-500 hover:-translate-y-2 border-0 bg-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-success opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                        <div className="relative z-10">
                          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-hero mb-6 group-hover:scale-110 transition-transform duration-300 shadow-soft">
                            <IconComponent className="h-10 w-10 text-white" />
                          </div>
                          <h3 className="font-heading text-2xl font-bold text-bvbp-corporate mb-4 group-hover:text-bvbp-growth transition-colors duration-300">
                            {value.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed text-lg">
                            {value.description}
                          </p>
                        </div>
                      </Card>;
                })}
                </div>
              </div>
            </div>
          </section>

          {/* Contato Section */}
          <section id="contato" ref={contactRef as React.RefObject<HTMLElement>} className={`py-20 bg-white transition-all duration-700 ${contactVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="font-heading text-3xl md:text-5xl font-bold text-bvbp-corporate mb-6">
                  Está perdendo dinheiro com retrabalho?
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Vamos conversar. Organizamos seus processos para que seu time ganhe foco e você volte a ter tempo para pensar no negócio.
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                {/* Contact Form */}
                <div>
                  <Card className="p-8">
                    <div className="mb-6">
                      <h3 className="font-heading text-2xl font-bold text-bvbp-corporate mb-4">
                        Envie sua Mensagem
                      </h3>
                      <p className="text-muted-foreground">
                        Preencha o formulário abaixo e entraremos em contato em até 4 horas úteis
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome completo *</Label>
                        <Input id="name" value={formData.name} onChange={e => handleInputChange("name", e.target.value)} placeholder="Seu nome completo" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input id="email" type="email" value={formData.email} onChange={e => handleInputChange("email", e.target.value)} placeholder="seu@email.com" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone *</Label>
                        <Input id="phone" value={formData.phone} onChange={e => handleInputChange("phone", e.target.value)} placeholder="+55 51 99999-9999" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="company">Empresa</Label>
                        <Input id="company" value={formData.company} onChange={e => handleInputChange("company", e.target.value)} placeholder="Nome da sua empresa" />
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
                        <Label htmlFor="interest">Serviço ou produto de interesse</Label>
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
                        <Textarea id="challenge" value={formData.challenge} onChange={e => handleInputChange("challenge", e.target.value)} placeholder="Conte-nos sobre seus principais desafios operacionais..." rows={4} required />
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
      </div>
    </>;
};
export default Index;