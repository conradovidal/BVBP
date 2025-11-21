import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, Target, Users, Zap, TrendingUp, Search, Sparkles, Check, Settings, Lightbulb,
  LinkedinIcon, Heart, Award, Clock, ArrowRight, Wrench, Rocket, Star, Crown,
  MailIcon, PhoneIcon, MapPinIcon, ClockIcon, MessageCircleIcon
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
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
        description: "Responderemos em até 4 horas úteis.",
      });
      setIsSubmitting(false);
      setFormData({ name: "", email: "", phone: "", company: "", role: "", interest: "", challenge: "" });
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const team = [
    {
      name: "Cristiano Basso",
      role: "",
      bio: "10+ anos otimizando processos em empresas de diversos tamanhos. Especialista em transformar caos operacional em crescimento sustentável.",
      linkedin: "https://www.linkedin.com/in/cristianobasso/",
      photo: "/lovable-uploads/5308fe52-0ff8-4f9d-8040-99ff6ff89d35.png"
    },
    {
      name: "Conrado Vidal",
      role: "",
      bio: "9+ anos ajudando empresas a alinhar estratégia e execução. Especialista em transformar o complexo em simples, promovendo transparência e colaboração.",
      linkedin: "https://www.linkedin.com/in/conradovidal/",
      photo: "/lovable-uploads/c237e246-d750-44a5-96a1-510e298e84ed.png"
    }
  ];

  const values = [
    {
      icon: Target,
      title: "Orientação a Resultado",
      description: "Não vendemos PowerPoint. Entregamos melhorias mensuráveis e duradouras que impactam diretamente o resultado da empresa."
    },
    {
      icon: Heart,
      title: "Honestidade",
      description: "Se não conseguirmos ajudar, falamos na lata. Só trabalhamos com empresas onde vemos potencial real de melhoria."
    },
    {
      icon: Award,
      title: "Qualidade",
      description: "Garantimos soluções práticas e sustentáveis, entregues com atenção aos detalhes e compromisso com resultados."
    }
  ];

  const services = [
    {
      title: "DIAGNÓSTICO",
      badge: "GRATUITO",
      badgeColor: "bg-bvbp-growth text-white",
      duration: "1 semana",
      icon: Search,
      description: "Clareza inicial sobre os principais gargalos e perdas da operação.",
      features: ["Conversa estruturada com o líder", "Levantamento e priorização dos processos críticos", "Estimativa de perdas (tempo e custo)", "Relatório executivo"],
      details: ["2 a 3 encontros curtos ao longo da semana", "Sem necessidade de envolver toda a equipe", "Entrega objetiva, sem burocracia"],
      popular: false
    },
    {
      title: "TRANSPARÊNCIA",
      badge: "GRATUITO - LIMITADO",
      badgeColor: "bg-gradient-to-r from-orange-500 to-red-500 text-white",
      duration: "2 semanas",
      icon: Zap,
      description: "Diagnóstico inicial gratuito para entender como um processo funciona hoje e onde estão as perdas.",
      features: ["Entrevistas com pessoas-chave", "Mapeamento completo de um processo", "Relatório executivo com oportunidades de economia mensuráveis"],
      details: ["2 semanas de análise intensiva", "Relatório executivo", "Apresentação dos resultados", "Sem compromisso de continuidade"],
      popular: false
    },
    {
      title: "VISÃO DE FUTURO",
      badge: "ESSENCIAL",
      badgeColor: "bg-blue-500 text-white",
      duration: "4 semanas",
      icon: Target,
      description: "Redesenho de um processo crítico e definição de como ele deve funcionar no futuro. Clareza sobre ganhos e roadmap de melhorias.",
      features: ["Redesenho de um processo crítico", "Definição do estado futuro", "Clareza sobre ganhos e roadmap", "Métrica base para acompanhamento"],
      details: ["Foco no processo que gera maior impacto", "Implementação hands-on junto com equipe", "Resultados visíveis em 30 dias", "Base para expansão futura"],
      popular: false
    },
    {
      title: "IMPLEMENTAÇÃO PRÁTICA",
      badge: "RECOMENDADO",
      badgeColor: "bg-orange-500 text-white",
      duration: "8 semanas",
      icon: Wrench,
      description: "Execução lado a lado para implementar mudanças em um processo, garantindo métricas claras e resultados visíveis em semanas.",
      features: ["Execução lado a lado com a equipe", "Implementação das mudanças na prática", "Métricas e acompanhamento contínuo", "Capacitação durante o processo"],
      details: ["Visão sistêmica da operação", "ROI transparente e mensurável", "Controle contínuo estabelecido", "Equipe preparada para evolução"],
      popular: true
    },
    {
      title: "AUTOMAÇÃO INTELIGENTE",
      badge: "PREMIUM",
      badgeColor: "bg-purple-500 text-white",
      duration: "10 semanas",
      icon: Star,
      description: "Introdução de automações e integração tecnológica em um processo, com dashboards e ganhos de eficiência comprovados.",
      features: ["Automações simples implementadas", "Integração entre sistemas", "Dashboards de acompanhamento", "Otimização tecnológica"],
      details: ["Foco em automações práticas", "Redução de trabalho manual", "Melhor visibilidade de dados", "ROI por redução de retrabalho"],
      popular: false
    },
    {
      title: "MELHORIA CONTÍNUA",
      badge: "PARTNER",
      badgeColor: "bg-bvbp-corporate text-white",
      duration: "12 semanas",
      icon: Crown,
      description: "Acompanhamento recorrente, ajustes e evolução estratégica de processos ao longo do tempo. Sustentabilidade e crescimento de longo prazo.",
      features: ["Acompanhamento recorrente mensal", "Ajustes e evolução de processos", "Garantia de sustentabilidade", "Autonomia total da equipe"],
      details: ["Transformação completa da operação", "Sustentabilidade e crescimento", "Autonomia total garantida", "Crescimento sustentável assegurado"],
      popular: false
    }
  ];

  const contactInfo = [
    {
      icon: MailIcon,
      title: "Email",
      info: "basso.vidal.bp@gmail.com",
      description: "Resposta em até 4 horas úteis",
      link: "mailto:basso.vidal.bp@gmail.com?subject=Contato%20BVBP"
    },
    {
      icon: PhoneIcon,
      title: "Telefone/WhatsApp",
      info: "+55 51 99653-5711\n+55 51 99899-1771",
      description: "Segunda a Sexta: 9h às 18h"
    },
    {
      icon: MapPinIcon,
      title: "Localização",
      info: "Porto Alegre, RS",
      description: "Atendimento presencial e remoto"
    }
  ];

  const benefits = [
    "Primeira conversa sempre gratuita",
    "Resposta em até 4 horas úteis",
    "Atendimento personalizado",
    "Diagnóstico inicial sem compromisso"
  ];

  return (
    <>
      <Helmet>
        <title>BVBP - Parceiros de negócio que transformam operações lado a lado com você</title>
        <meta name="description" content="Parceria boutique para SMBs. Diagnóstico gratuito, soluções sob medida e resultados mensuráveis em até 90 dias." />
      </Helmet>

      <div className="min-h-screen">
        <Header />
        <main>
          {/* Hero Section */}
          <section id="inicio" className="relative py-20 lg:py-32 bg-gradient-hero overflow-hidden">
            <div className="absolute inset-0 bg-black/5"></div>
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-5xl mx-auto text-center space-y-12">
                <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight animate-fade-in">
                  <span className="text-bvbp-growth-light">Crescimento</span> sem caos.
                </h1>

                <h2 className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed animate-fade-in [animation-delay:200ms]">
                  Transformamos processos bagunçados em sistemas que funcionam, com resultados mensuráveis em até 90 dias.
                </h2>

                <div className="pt-8 animate-fade-in [animation-delay:400ms] flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <Button
                    variant="success"
                    size="xl"
                    className="group shadow-strong bg-bvbp-growth hover:bg-bvbp-growth/90 text-white font-bold px-8 py-4 text-lg hover:scale-105 transform transition-bounce pulse"
                    onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Agendar diagnóstico gratuito
                  </Button>
                  <Button
                    variant="outline-hero"
                    size="xl"
                    onClick={() => window.location.href = '/calculadora-roi'}
                    className="hover:scale-105 transition-transform shadow-soft bg-white/10 hover:bg-white/20 text-white border-white/30"
                  >
                    Calculadora ROI
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Problem Section */}
          <section className="py-20 bg-gradient-subtle relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-warning"></div>
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-warning mb-8 shadow-warning">
                    <Search className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="font-heading text-3xl md:text-5xl font-bold text-bvbp-corporate mb-6">
                    Reconhece estes sintomas?
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Identificamos os problemas mais comuns em empresas em crescimento
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {[
                    {
                      title: "Gargalo nas decisões da alta liderança",
                      description: "Estratégia de lado, tempo gasto apagando incêndios"
                    },
                    {
                      title: "Reuniões sem objetivo",
                      description: "Horas perdidas em alinhamentos que não geram resultado"
                    },
                    {
                      title: "Crescimento travado pela operação",
                      description: "A receita sobe, a eficiência despenca"
                    },
                    {
                      title: "Equipe desmotivada pelo retrabalho",
                      description: "Processos mal definidos geram frustração e desperdício"
                    }
                  ].map((problem, index) => (
                    <div key={index} className="group p-6 bg-white rounded-lg hover:shadow-strong transition-all duration-500 hover:-translate-y-2 border-0">
                      <div className="flex items-start space-x-4">
                        <div className="relative inline-flex items-center justify-center w-12 h-12 aspect-square rounded-full border-2 border-muted group-hover:border-bvbp-growth transition-all duration-300 bg-white">
                          <Check className="h-6 w-6 text-bvbp-growth opacity-0 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100" />
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
                    </div>
                  ))}
                </div>

                <div className="text-center mt-16">
                  <div className="p-6 bg-bvbp-growth rounded-xl">
                    <p className="text-xl text-white font-semibold leading-relaxed">
                      Se sua empresa parece ter crescido para o caos, você não está sozinho.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Differentiation Section */}
          <section className="py-20 bg-white relative">
            <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-success"></div>
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-bvbp-growth mb-8 shadow-success">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="font-heading text-3xl md:text-5xl font-bold text-bvbp-corporate mb-6">
                    Nossa forma de trabalhar é diferente
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Resultados práticos através de metodologias comprovadas
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    {
                      icon: Target,
                      title: "Customização Real",
                      description: "Nada de receita pronta — cada solução é feita para sua realidade. Usamos técnicas testadas, mas adaptamos ao seu contexto."
                    },
                    {
                      icon: Zap,
                      title: "Execução Lado a Lado",
                      description: "Não entregamos apenas relatórios. Atuamos junto com sua equipe, implementando mudanças na prática."
                    },
                    {
                      icon: Settings,
                      title: "ROI Transparente",
                      description: "Mostramos onde estão as ineficiências e como resolvê-las. Todas as iniciativas têm métricas claras."
                    },
                    {
                      icon: Lightbulb,
                      title: "Autonomia em 90 dias",
                      description: "Em até 90 dias, você ganha melhorias sustentáveis prontas para a melhoria contínua."
                    }
                  ].map((diff, index) => (
                    <div key={index} className="group text-center p-8 hover:shadow-strong transition-all duration-500 hover:-translate-y-2 border-0 bg-gradient-subtle relative overflow-hidden rounded-lg">
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
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Quem Somos Section */}
          <section id="quem-somos" className="py-20 bg-gradient-subtle">
            <div className="container mx-auto px-4">
              {/* Mission */}
              <div className="max-w-4xl mx-auto text-center mb-20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-bvbp-growth mb-8 shadow-success">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h2 className="font-heading text-3xl md:text-5xl font-bold text-bvbp-corporate mb-8">
                  Nossa Missão
                </h2>
                <p className="text-xl md:text-2xl text-foreground leading-relaxed font-medium">
                  Transformamos o <span className="text-bvbp-growth font-bold">caos operacional</span> em <span className="text-bvbp-growth font-bold">crescimento estruturado</span>. Trabalhamos lado a lado com empresas para implementar sistemas e processos que realmente funcionam, eliminando ineficiências e criando bases sólidas para o sucesso sustentável.
                </p>
              </div>

              {/* Team */}
              <div className="mb-20">
                <div className="text-center mb-16">
                  <h2 className="font-heading text-3xl md:text-5xl font-bold text-bvbp-corporate mb-6">
                    Nosso Time
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Conheça os especialistas que transformam visão em realidade
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                  {team.map((member, index) => (
                    <Card key={index} className="group overflow-hidden hover:shadow-strong transition-all duration-500 hover:-translate-y-2 bg-white border-0">
                      <div className="relative">
                        <AspectRatio ratio={4 / 5}>
                          {member.photo ? (
                            <img
                              src={member.photo}
                              alt={`Foto de ${member.name}`}
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <Users className="h-16 w-16 text-muted-foreground/50" />
                            </div>
                          )}
                        </AspectRatio>
                        <div className="absolute top-4 right-4">
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`LinkedIn de ${member.name}`}
                            className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm hover:bg-bvbp-growth hover:text-white transition-all duration-300 shadow-soft"
                          >
                            <LinkedinIcon className="h-6 w-6" />
                          </a>
                        </div>
                      </div>
                      <div className="p-8">
                        <h3 className="font-heading text-2xl font-bold text-bvbp-corporate mb-2">
                          {member.name}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed text-lg">
                          {member.bio}
                        </p>
                      </div>
                    </Card>
                  ))}
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
                    return (
                      <Card key={index} className="group p-8 text-center hover:shadow-strong transition-all duration-500 hover:-translate-y-2 border-0 bg-white relative overflow-hidden">
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
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Serviços Section */}
          <section id="servicos" className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="font-heading text-3xl md:text-5xl font-bold text-bvbp-corporate mb-6">
                  Nossos Serviços
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Soluções customizadas para otimizar sua operação, reduzir custos e aumentar a eficiência
                </p>
              </div>

              <div className="space-y-8 max-w-7xl mx-auto">
                {/* First row - 3 cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.slice(0, 3).map((service, index) => {
                    const IconComponent = service.icon;
                    return (
                      <Card key={index} className={`relative p-8 h-full flex flex-col hover:shadow-strong transition-smooth ${service.popular ? 'ring-2 ring-bvbp-growth' : ''}`}>
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
                          {service.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-start space-x-2">
                              <CheckCircle className="h-4 w-4 text-bvbp-growth mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-foreground">{feature}</span>
                            </div>
                          ))}
                        </div>

                        {/* Details */}
                        <div className="bg-muted/30 p-4 rounded-lg mb-6">
                          <h4 className="font-semibold text-bvbp-corporate mb-2">Detalhes:</h4>
                          <div className="space-y-1">
                            {service.details.map((detail, detailIndex) => (
                              <div key={detailIndex} className="text-sm text-muted-foreground">
                                • {detail}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* CTA */}
                        <Button
                          variant={service.popular ? "success" : "hero"}
                          className="w-full px-4 py-2 text-center"
                          size="lg"
                          onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                          Quero saber mais
                        </Button>
                      </Card>
                    );
                  })}
                </div>

                {/* Second row - 3 cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.slice(3, 6).map((service, index) => {
                    const IconComponent = service.icon;
                    return (
                      <Card key={index + 3} className={`relative p-8 h-full flex flex-col hover:shadow-strong transition-smooth ${service.popular ? 'ring-2 ring-bvbp-growth' : ''}`}>
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
                          {service.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-start space-x-2">
                              <CheckCircle className="h-4 w-4 text-bvbp-growth mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-foreground">{feature}</span>
                            </div>
                          ))}
                        </div>

                        {/* Details */}
                        <div className="bg-muted/30 p-4 rounded-lg mb-6">
                          <h4 className="font-semibold text-bvbp-corporate mb-2">Detalhes:</h4>
                          <div className="space-y-1">
                            {service.details.map((detail, detailIndex) => (
                              <div key={detailIndex} className="text-sm text-muted-foreground">
                                • {detail}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* CTA */}
                        <Button
                          variant={service.popular ? "success" : "hero"}
                          className="w-full px-4 py-2 text-center"
                          size="lg"
                          onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                          Quero saber mais
                        </Button>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Authority & Story Section */}
          <section className="py-20 bg-gradient-hero relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-5xl mx-auto">
                <Card className="p-10 md:p-16 bg-white/95 backdrop-blur-sm border-0 shadow-strong">
                  <div className="text-center space-y-8 mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-hero mb-6 shadow-soft">
                      <CheckCircle className="h-8 w-8 text-white" />
                    </div>
                    <blockquote className="text-2xl md:text-3xl font-medium text-bvbp-corporate italic leading-relaxed">
                      "Vivenciamos na prática os desafios de escalar operações em empresas reais. Não é teoria, é experiência de quem já esteve dentro."
                    </blockquote>

                    <div className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                      Unimos mais de 20 anos em operações empresariais com expertise em planejamento, processos, gestão e execução. Nossa atuação se apoia na facilitação, priorização, pensamento sistêmico, e metodologias ágeis, sempre orientados a resultados mensuráveis.
                    </div>
                  </div>

                  <h2 className="font-heading text-3xl md:text-5xl font-bold text-bvbp-corporate mb-8 text-center">Por que começamos a BVBP</h2>
                  <div className="prose prose-xl max-w-none">
                    <p className="text-foreground leading-relaxed mb-8 text-lg">
                      A BVBP surgiu a partir da nossa experiência em transformar operações complexas em sistemas funcionais, focados em resultados reais. Ao longo dos anos, trabalhamos com diversas empresas e entendemos que otimizar processos não é apenas sobre eficiência, mas sobre garantir que cada decisão estratégica seja clara e mensurável.
                    </p>
                    <p className="text-foreground leading-relaxed mb-8 text-lg">
                      Acreditamos que é essencial criar sistemas que não só otimizem, mas que tragam clareza e permitam a evolução contínua das equipes e resultados. Queremos ir além do diagnóstico: buscamos impactar positivamente a forma como as empresas operam no dia a dia, fornecendo a estrutura necessária para tomar decisões estratégicas com confiança e priorizar o que realmente importa.
                    </p>
                    <div className="p-6 bg-bvbp-growth rounded-xl mb-8">
                      <p className="text-white font-semibold text-xl leading-relaxed">
                        Nosso objetivo é continuar explorando novos desafios, ajudando organizações a alcançar o crescimento com propósito, clareza e, principalmente, com a capacidade de se adaptar e evoluir com consistência.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </section>

          {/* Contato Section */}
          <section id="contato" className="py-20 bg-gradient-subtle">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <div className="inline-flex items-center px-8 py-4 rounded-full bg-primary text-white font-bold shadow-elegant hover:shadow-glow transition-all duration-300 transform hover:scale-105 mb-8">
                  <MessageCircleIcon className="h-6 w-6 mr-3" />
                  Primeira conversa sempre gratuita
                </div>
                <h2 className="font-heading text-3xl md:text-5xl font-bold text-bvbp-corporate mb-6">
                  Fale Conosco
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Agende uma conversa sem compromisso. Entendemos seus desafios e propomos soluções práticas para sua realidade.
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
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
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
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="seu@email.com"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="+55 51 99999-9999"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="company">Empresa</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => handleInputChange("company", e.target.value)}
                          placeholder="Nome da sua empresa"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role">Cargo/Função</Label>
                        <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
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
                        <Select value={formData.interest} onValueChange={(value) => handleInputChange("interest", value)}>
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
                        <Textarea
                          id="challenge"
                          value={formData.challenge}
                          onChange={(e) => handleInputChange("challenge", e.target.value)}
                          placeholder="Conte-nos sobre seus principais desafios operacionais..."
                          rows={4}
                          required
                        />
                      </div>

                      <div className="flex items-center space-x-3">
                        <Checkbox id="consent" required />
                        <Label htmlFor="consent" className="text-sm text-muted-foreground">
                          Concordo que a BVBP entre em contato sobre minha solicitação.
                        </Label>
                      </div>

                      <Button
                        type="submit"
                        variant="hero"
                        size="xl"
                        className="w-full"
                        disabled={isSubmitting}
                      >
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
                        return (
                          <Card key={index} className="p-6 hover:shadow-soft transition-smooth">
                            <div className="flex items-start space-x-4">
                              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-hero">
                                <IconComponent className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-bvbp-corporate mb-1">
                                  {contact.title}
                                </h4>
                                {contact.link ? (
                                  <a
                                    href={contact.link}
                                    className="text-lg font-medium text-foreground mb-1 whitespace-pre-line hover:text-bvbp-growth transition-colors"
                                  >
                                    {contact.info}
                                  </a>
                                ) : (
                                  <p className="text-lg font-medium text-foreground mb-1 whitespace-pre-line">
                                    {contact.info}
                                  </p>
                                )}
                                <p className="text-sm text-muted-foreground">
                                  {contact.description}
                                </p>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>

                  {/* Benefits */}
                  <Card className="p-6 bg-bvbp-growth/10 border-bvbp-growth/20">
                    <h4 className="font-heading text-xl font-bold text-bvbp-corporate mb-4">
                      Por Que Falar Conosco?
                    </h4>
                    <div className="space-y-3">
                      {benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-bvbp-growth flex-shrink-0" />
                          <span className="text-foreground">{benefit}</span>
                        </div>
                      ))}
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
                  <Card className="p-6 bg-bvbp-growth text-white">
                    <div className="text-center space-y-4">
                      <h4 className="font-heading text-xl font-bold">
                        Prefere Conversar pelo WhatsApp?
                      </h4>
                      <p className="text-white/90">
                        Clique no botão abaixo para iniciar uma conversa direta conosco
                      </p>
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full bg-white text-bvbp-growth hover:bg-white/90"
                        onClick={() => window.open('https://wa.me/5551996535711', '_blank')}
                      >
                        Falar pelo WhatsApp
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
