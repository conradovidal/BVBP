import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    title: "DIAGNÓSTICO",
    badge: "GRATUITO",
    badgeColor: "bg-bvbp-growth text-white",
    duration: "1 semana",
    icon: Search,
    description: "Mostramos onde você perde dinheiro com retrabalho e processos confusos.",
    features: ["Conversa com o líder", "Mapeamento dos processos que mais travam", "Estimativa de quanto você perde por mês", "Relatório de 1 página com próximos passos"],
    details: ["2 a 3 encontros ao longo da semana", "Sem necessidade de envolver toda a equipe", "Entrega objetiva, sem burocracia"],
    popular: false,
    cta: "Quero saber onde estou perdendo dinheiro"
  }, {
    title: "TRANSPARÊNCIA",
    badge: "GRATUITO - LIMITADO",
    badgeColor: "bg-gradient-to-r from-orange-500 to-red-500 text-white",
    duration: "2 semanas",
    icon: Zap,
    description: "Mergulho em um processo crítico para mostrar exatamente onde está o problema.",
    features: ["Entrevistas com quem faz o trabalho", "Mapeamento completo do processo", "Quanto você está perdendo nisso", "Relatório executivo"],
    details: ["2 semanas de análise intensiva", "Relatório executivo detalhado", "Apresentação dos resultados", "Sem compromisso de continuidade"],
    popular: false,
    cta: "Quero entender meu processo crítico"
  }, {
    title: "VISÃO DE FUTURO",
    badge: "ESSENCIAL",
    badgeColor: "bg-blue-500 text-white",
    duration: "4 semanas",
    icon: Target,
    description: "Redesenhamos um processo crítico e mostramos como ele deve funcionar. Seu time ganha clareza, você ganha previsibilidade.",
    features: ["Processo redesenhado do zero", "Jeito claro de trabalhar definido", "Ganhos mensais estimados", "Plano de implementação"],
    details: ["Foco no processo de maior impacto", "Clareza sobre próximos passos", "Base para expansão futura", "ROI transparente"],
    popular: false,
    cta: "Quero redesenhar meu processo"
  }, {
    title: "IMPLEMENTAÇÃO PRÁTICA",
    badge: "RECOMENDADO",
    badgeColor: "bg-orange-500 text-white",
    duration: "8 semanas",
    icon: Wrench,
    description: "Executamos lado a lado com seu time. Cortamos retrabalho, definimos o jeito certo de fazer, e você vê resultado em semanas.",
    features: ["Trabalhamos junto com seu time", "Mudanças aplicadas na prática", "Acompanhamento semanal de resultados", "Time capacitado durante o processo"],
    details: ["Execução hands-on", "Métricas claras de progresso", "Time preparado para evoluir sozinho", "Resultados visíveis rapidamente"],
    popular: true,
    cta: "Quero implementar agora"
  }, {
    title: "AUTOMAÇÃO INTELIGENTE",
    badge: "PREMIUM",
    badgeColor: "bg-purple-500 text-white",
    duration: "10 semanas",
    icon: Star,
    description: "Tiramos trabalho manual da equipe com automação simples. Menos retrabalho, mais foco no que importa.",
    features: ["Automações práticas implementadas", "Menos trabalho manual", "Dashboards simples para acompanhar", "Redução de erros e retrabalho"],
    details: ["Automações que realmente funcionam", "Integração entre ferramentas", "Redução de trabalho repetitivo", "ROI por economia de tempo"],
    popular: false,
    cta: "Quero reduzir trabalho manual"
  }, {
    title: "MELHORIA CONTÍNUA",
    badge: "PARTNER",
    badgeColor: "bg-bvbp-corporate text-white",
    duration: "12 semanas",
    icon: Crown,
    description: "Acompanhamento mensal para garantir que o time segue evoluindo sozinho. Você ganha autonomia total.",
    features: ["Acompanhamento mensal", "Ajustes conforme o negócio cresce", "Time autônomo para melhorar sozinho", "Crescimento sustentável"],
    details: ["Evolução contínua da operação", "Autonomia total garantida", "Processos que se ajustam ao crescimento", "Sustentabilidade de longo prazo"],
    popular: false,
    cta: "Quero crescer com autonomia"
  }];
  const contactInfo = [{
    icon: MailIcon,
    title: "Email",
    info: "basso.vidal.bp@gmail.com",
    description: "Resposta em até 4 horas úteis",
    link: "mailto:basso.vidal.bp@gmail.com?subject=Contato%20BVBP"
  }, {
    icon: PhoneIcon,
    title: "Telefone/WhatsApp",
    info: "+55 51 99653-5711\n+55 51 99899-1771",
    description: "Segunda a Sexta: 9h às 18h"
  }, {
    icon: MapPinIcon,
    title: "Localização",
    info: "Porto Alegre, RS",
    description: "Atendimento presencial e remoto"
  }];
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
                <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight animate-fade-in">
                  Você está <span className="text-bvbp-growth font-bold">perdendo dinheiro</span> todo mês devido a{" "}
                  <span className="text-bvbp-growth font-bold">planejamento e processos mal executados</span>
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
          <section id="servicos" ref={servicesRef as React.RefObject<HTMLElement>} className={`py-20 bg-white transition-all duration-700 ${servicesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="font-heading text-3xl md:text-5xl font-bold text-bvbp-corporate mb-6">
                  Como trabalhamos com você
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Seu time ganha foco e autonomia, e você para de viver apagando incêndio.
                </p>
              </div>

              <div className="space-y-8 max-w-7xl mx-auto">
                {/* First row - 3 cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.slice(0, 3).map((service, index) => {
                  const IconComponent = service.icon;
                  return <Card key={index} className={`relative p-8 h-full flex flex-col hover:shadow-strong transition-smooth ${service.popular ? 'ring-2 ring-bvbp-growth' : ''}`}>
                        {/* Badge */}
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className={service.badgeColor}>
                            {service.badge}
                          </Badge>
                        </div>

                        {/* Header */}
                        <div className="text-center mb-6 pt-4">
                          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${service.popular ? 'bg-bvbp-growth' : 'bg-bvbp-corporate'}`}>
                            <IconComponent className="h-8 w-8 text-white" />
                          </div>

                          <h3 className="font-heading text-2xl font-bold text-bvbp-corporate mb-2">
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
                        <div className="space-y-3 mb-6 flex-1">
                          <h4 className="font-semibold text-bvbp-corporate">O que está incluído:</h4>
                          {service.features.map((feature, featureIndex) => <div key={featureIndex} className="flex items-start space-x-2">
                              <CheckCircle className="h-4 w-4 text-bvbp-growth mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-foreground">{feature}</span>
                            </div>)}
                        </div>

                        {/* Details */}
                        <div className="bg-muted/30 p-4 rounded-lg mb-6">
                          <h4 className="font-semibold text-bvbp-corporate mb-2">Detalhes:</h4>
                          <div className="space-y-1">
                            {service.details.map((detail, detailIndex) => <div key={detailIndex} className="text-sm text-muted-foreground">
                                • {detail}
                              </div>)}
                          </div>
                        </div>

                        {/* CTA */}
                        <Button variant={service.popular ? "success" : "hero"} className="w-full px-4 py-2 text-center" size="lg" onClick={() => document.getElementById('contato')?.scrollIntoView({
                      behavior: 'smooth'
                    })}>
                          {service.cta || "Quero saber mais"}
                        </Button>
                      </Card>;
                })}
                </div>

                {/* Second row - 3 cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.slice(3, 6).map((service, index) => {
                  const IconComponent = service.icon;
                  return <Card key={index + 3} className={`relative p-8 h-full flex flex-col hover:shadow-strong transition-smooth ${service.popular ? 'ring-2 ring-bvbp-growth' : ''}`}>
                        {/* Badge */}
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className={service.badgeColor}>
                            {service.badge}
                          </Badge>
                        </div>

                        {/* Header */}
                        <div className="text-center mb-6 pt-4">
                          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${service.popular ? 'bg-bvbp-growth' : 'bg-bvbp-corporate'}`}>
                            <IconComponent className="h-8 w-8 text-white" />
                          </div>

                          <h3 className="font-heading text-2xl font-bold text-bvbp-corporate mb-2">
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
                        <div className="space-y-3 mb-6 flex-1">
                          <h4 className="font-semibold text-bvbp-corporate">O que está incluído:</h4>
                          {service.features.map((feature, featureIndex) => <div key={featureIndex} className="flex items-start space-x-2">
                              <CheckCircle className="h-4 w-4 text-bvbp-growth mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-foreground">{feature}</span>
                            </div>)}
                        </div>

                        {/* Details */}
                        <div className="bg-muted/30 p-4 rounded-lg mb-6">
                          <h4 className="font-semibold text-bvbp-corporate mb-2">Detalhes:</h4>
                          <div className="space-y-1">
                            {service.details.map((detail, detailIndex) => <div key={detailIndex} className="text-sm text-muted-foreground">
                                • {detail}
                              </div>)}
                          </div>
                        </div>

                        {/* CTA */}
                        <Button variant={service.popular ? "success" : "hero"} className="w-full px-4 py-2 text-center" size="lg" onClick={() => document.getElementById('contato')?.scrollIntoView({
                      behavior: 'smooth'
                    })}>
                          {service.cta || "Quero saber mais"}
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
                            <SelectItem value="Diagnóstico (gratuito)">Diagnóstico (gratuito)</SelectItem>
                            <SelectItem value="Transparência (gratuito por tempo limitado)">Transparência (gratuito por tempo limitado)</SelectItem>
                            <SelectItem value="Visão de Futuro">Visão de Futuro</SelectItem>
                            <SelectItem value="Implementação Prática">Implementação Prática</SelectItem>
                            <SelectItem value="Automação Inteligente">Automação Inteligente</SelectItem>
                            <SelectItem value="Melhoria Contínua">Melhoria Contínua</SelectItem>
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

                    <div className="space-y-6">
                      {contactInfo.map((contact, index) => {
                      const IconComponent = contact.icon;
                      return <Card key={index} className="p-6 hover:shadow-soft transition-smooth">
                            <div className="flex items-start space-x-4">
                              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-hero">
                                <IconComponent className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-bvbp-corporate mb-1">
                                  {contact.title}
                                </h4>
                                {contact.link ? <a href={contact.link} className="text-lg font-medium text-foreground mb-1 whitespace-pre-line hover:text-bvbp-growth transition-colors">
                                    {contact.info}
                                  </a> : <p className="text-lg font-medium text-foreground mb-1 whitespace-pre-line">
                                    {contact.info}
                                  </p>}
                                <p className="text-sm text-muted-foreground">
                                  {contact.description}
                                </p>
                              </div>
                            </div>
                          </Card>;
                    })}
                    </div>
                  </div>

                  {/* Benefits */}
                  <Card className="p-6 bg-bvbp-growth/10 border-bvbp-growth/20">
                    <h4 className="font-heading text-xl font-bold text-bvbp-corporate mb-4">
                      Por Que Falar Conosco?
                    </h4>
                    <div className="space-y-3">
                      {benefits.map((benefit, index) => <div key={index} className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-bvbp-growth flex-shrink-0" />
                          <span className="text-foreground">{benefit}</span>
                        </div>)}
                    </div>
                  </Card>

                  {/* Operating Hours */}
                  <Card className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-hero">
                        <ClockIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-bvbp-corporate mb-2">
                          Horário de Atendimento
                        </h4>
                        <div className="space-y-1 text-sm">
                          <p className="text-foreground">
                            <strong>Segunda a Sexta:</strong> 9h às 18h
                          </p>
                          <p className="text-muted-foreground">
                            Resposta por email em até 4 horas úteis
                          </p>
                          <p className="text-muted-foreground">
                            WhatsApp: resposta no mesmo dia
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* WhatsApp Button */}
                  
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