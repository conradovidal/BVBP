import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Crown, CheckCircle2, XCircle, Layers, Target, Users, Settings, TrendingUp, ArrowRight, Clock, FileText, Zap, BarChart3, GraduationCap, Repeat } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { validateLeadData } from "@/lib/leadValidation";
import { Link } from "react-router-dom";

const ProgramaCustomizadoPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    interest: "Programa Customizado de Melhoria",
    challenge: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate form data before submitting
    const dataToValidate = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      company: formData.company,
      role: formData.role || null,
      interest: formData.interest,
      challenge: formData.challenge || null,
      source: 'programa-customizado-page',
      page_url: window.location.href
    };

    const validation = validateLeadData(dataToValidate);
    
    if (!validation.success) {
      toast({
        title: "Dados inválidos",
        description: validation.errors?.join(", ") || "Verifique os campos e tente novamente.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase.from('leads').insert(validation.data!);

      if (error) throw error;

      toast({
        title: "Recebemos seus dados.",
        description: "Responderemos em até 4 horas úteis."
      });
      
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        role: "",
        interest: "Programa Customizado de Melhoria",
        challenge: ""
      });
    } catch (error) {
      toast({
        title: "Erro ao enviar",
        description: "Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const scrollToContact = () => {
    document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' });
  };

  const faqs = [
    {
      question: "Qual a diferença do Sprint de Otimização?",
      answer: "O Sprint ataca 1 fluxo em 2 semanas para um quick win rápido. O Programa Customizado vai além: otimiza 2-3 fluxos críticos em ondas, implementa governança mínima e capacita o time para sustentar. É para quem precisa de uma transformação mais profunda e duradoura."
    },
    {
      question: "Preciso fazer o Diagnóstico Operacional antes?",
      answer: "Sim. O Diagnóstico é a porta de entrada para o Programa Customizado. Ele mapeia os fluxos críticos, identifica prioridades e define a sequência de ondas. Sem esse mapeamento, não conseguimos desenhar um programa efetivo."
    },
    {
      question: "Como evitar que o programa vire infinito?",
      answer: "Escopo fechado desde o início. Definimos juntos quais fluxos serão otimizados, em quantas ondas, e com que critérios de sucesso. Não adicionamos escopo sem renegociar. O objetivo é entregar resultado e sair, não criar dependência."
    },
    {
      question: "O time precisa parar para participar?",
      answer: "Não. Trabalhamos em paralelo com a operação. Envolvemos as pessoas certas nos momentos certos — workshops curtos, validações rápidas e implementação acompanhada. O time continua tocando o dia a dia."
    },
    {
      question: "O que acontece depois do programa?",
      answer: "O time sai capacitado para manter os novos processos. Se quiserem suporte contínuo, oferecemos a Implementação de Governança de Execução para manter a disciplina. Mas o objetivo é vocês não precisarem de nós."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Programa Customizado de Melhoria | BVBP</title>
        <meta name="description" content="Programa sob medida para otimizar 2-3 fluxos críticos em ondas, com implementação acompanhada e capacitação do time. 6 a 12 semanas para resultado duradouro." />
      </Helmet>

      <div className="min-h-screen">
        <Header />
        <main className="pt-0">
          {/* Hero Section */}
          <section className="relative py-20 lg:py-28 bg-gradient-hero overflow-hidden">
            <div className="absolute inset-0 bg-black/5"></div>
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                <Crown className="w-16 h-16 mx-auto mb-6 text-white" />
                <p className="text-white/80 text-lg mb-4">6 a 12 semanas · Múltiplos fluxos · Resultado duradouro</p>
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                  Para quando o quick win não é suficiente
                </h1>
                <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                  Otimizamos 2-3 fluxos críticos em ondas, implementamos governança mínima para sustentar e capacitamos o time para manter depois.
                </p>
                <Button 
                  variant="success" 
                  size="xl" 
                  onClick={scrollToContact}
                  className="bg-bvbp-growth hover:bg-bvbp-growth/90"
                >
                  Quero um plano sob medida
                </Button>
              </div>
            </div>
          </section>

          {/* Pré-requisito Section */}
          <section className="py-12 bg-amber-50 border-y border-amber-200">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <Card className="border-amber-300 bg-amber-50/50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-heading text-xl font-bold text-amber-900 mb-2">
                          Pré-requisito: Diagnóstico Operacional
                        </h3>
                        <p className="text-amber-800 leading-relaxed">
                          O Programa Customizado é desenhado a partir do Diagnóstico Operacional. Ele identifica os fluxos críticos, define prioridades e desenha a sequência de ondas. Sem esse mapeamento, não conseguimos criar um programa efetivo.
                        </p>
                        <Button 
                          variant="outline" 
                          className="mt-4 border-amber-600 text-amber-700 hover:bg-amber-100"
                          onClick={() => window.location.href = '/diagnostico-operacional'}
                        >
                          Conhecer o Diagnóstico
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Para quem é Section */}
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate text-center mb-12">
                  Para quem é
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Funciona bem para */}
                  <Card className="border-green-200 bg-green-50/50">
                    <CardContent className="p-6">
                      <h3 className="font-heading text-xl font-bold text-green-800 mb-6 flex items-center gap-2">
                        <CheckCircle2 className="w-6 h-6" />
                        Funciona bem para
                      </h3>
                      <ul className="space-y-4">
                        {[
                          "Empresas que já fizeram um Diagnóstico ou Sprint e viram resultado",
                          "Operação com múltiplos fluxos críticos que precisam de ajuste",
                          "Liderança que quer transformação estruturada, não pontual",
                          "Time que precisa de capacitação para manter os novos processos"
                        ].map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-green-900">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Não é para */}
                  <Card className="border-red-200 bg-red-50/50">
                    <CardContent className="p-6">
                      <h3 className="font-heading text-xl font-bold text-red-800 mb-6 flex items-center gap-2">
                        <XCircle className="w-6 h-6" />
                        Não é para
                      </h3>
                      <ul className="space-y-4">
                        {[
                          "Quem quer terceirizar execução — o time continua tocando",
                          "Empresas sem clareza do problema — comece pelo Diagnóstico",
                          "Quem busca resultado em 2 semanas — para isso, Sprint é melhor",
                          "Organizações que não podem envolver o time na mudança"
                        ].map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <span className="text-red-900">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Escopo Section */}
          <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate text-center mb-12">
                  O que está no escopo
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { icon: Layers, text: "Plano por ondas com escopo e sequência de execução" },
                    { icon: Zap, text: "Otimização de 2 a 3 fluxos críticos" },
                    { icon: Users, text: "Implementação acompanhada para garantir adoção" },
                    { icon: GraduationCap, text: "Capacitação do time para manter depois" },
                    { icon: Settings, text: "Governança mínima para sustentar os ganhos" },
                    { icon: BarChart3, text: "Métricas de acompanhamento por onda" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-100">
                      <item.icon className="w-6 h-6 text-bvbp-growth flex-shrink-0" />
                      <span className="text-foreground">{item.text}</span>
                    </div>
                  ))}
                </div>
                <Card className="mt-8 border-bvbp-corporate/20 bg-bvbp-corporate/5">
                  <CardContent className="p-6">
                    <p className="text-bvbp-corporate font-medium text-center">
                      <strong>Regra clara:</strong> escopo fechado desde o início. Definimos juntos quais fluxos, em quantas ondas, e com que critérios de sucesso. Não adicionamos escopo sem renegociar.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Como funciona Section */}
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate text-center mb-12">
                  Como funciona
                </h2>
                <div className="grid md:grid-cols-5 gap-4">
                  {[
                    { step: 1, icon: Target, title: "Diagnóstico", desc: "Mapeamento dos fluxos críticos e prioridades" },
                    { step: 2, icon: Layers, title: "Plano de Ondas", desc: "Definição de escopo, sequência e critérios" },
                    { step: 3, icon: Zap, title: "Execução por Onda", desc: "Otimização de 1 fluxo por vez, com validação" },
                    { step: 4, icon: GraduationCap, title: "Capacitação", desc: "Transferência de conhecimento para o time" },
                    { step: 5, icon: TrendingUp, title: "Governança", desc: "Implementação de cadência para sustentar" }
                  ].map((item, index) => (
                    <div key={index} className="relative">
                      <Card className="h-full border-gray-200 hover:border-bvbp-growth/50 hover:shadow-md transition-all">
                        <CardContent className="p-4 text-center">
                          <div className="w-10 h-10 rounded-full bg-bvbp-growth text-white flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                            {item.step}
                          </div>
                          <item.icon className="w-8 h-8 text-bvbp-corporate mx-auto mb-2" />
                          <h3 className="font-heading font-bold text-sm text-bvbp-corporate mb-1">{item.title}</h3>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </CardContent>
                      </Card>
                      {index < 4 && (
                        <ArrowRight className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 w-6 h-6 text-gray-300" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Entregáveis + Prazo Section */}
          <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Entregáveis */}
                  <div>
                    <h2 className="font-heading text-2xl md:text-3xl font-bold text-bvbp-corporate mb-8 flex items-center gap-3">
                      <FileText className="w-8 h-8 text-bvbp-growth" />
                      Entregáveis
                    </h2>
                    <ul className="space-y-4">
                      {[
                        "Plano de ondas com escopo, cronograma e critérios de sucesso",
                        "Processos otimizados documentados e validados",
                        "Governança mínima implementada (cadência, ritos, métricas)",
                        "Time capacitado com materiais de referência",
                        "Relatório de resultados por onda com métricas de impacto"
                      ].map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-bvbp-growth mt-0.5 flex-shrink-0" />
                          <span className="text-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Prazo */}
                  <div>
                    <h2 className="font-heading text-2xl md:text-3xl font-bold text-bvbp-corporate mb-8 flex items-center gap-3">
                      <Clock className="w-8 h-8 text-bvbp-growth" />
                      Prazo
                    </h2>
                    <Card className="border-bvbp-growth/30 bg-bvbp-growth/5">
                      <CardContent className="p-6">
                        <div className="text-center">
                          <p className="text-4xl font-bold text-bvbp-growth mb-2">6 a 12 semanas</p>
                          <p className="text-muted-foreground mb-4">Dependendo do número de fluxos e ondas</p>
                          <div className="text-sm text-foreground space-y-2">
                            <p>• Cada onda: 2-3 semanas (1 fluxo)</p>
                            <p>• Capacitação integrada ao longo do programa</p>
                            <p>• Governança implementada na última onda</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* O que muda Section */}
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate text-center mb-12">
                  O que muda na sua operação
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { 
                      icon: Zap, 
                      title: "Múltiplos fluxos otimizados", 
                      desc: "2-3 processos críticos funcionando com menos fila, menos retrabalho e mais clareza" 
                    },
                    { 
                      icon: Users, 
                      title: "Time capacitado", 
                      desc: "Equipe treinada para manter os novos processos sem depender de consultoria" 
                    },
                    { 
                      icon: TrendingUp, 
                      title: "Governança sustentável", 
                      desc: "Cadência e métricas implementadas para sustentar os ganhos ao longo do tempo" 
                    }
                  ].map((item, index) => (
                    <Card key={index} className="border-gray-200 hover:border-bvbp-growth/50 hover:shadow-md transition-all">
                      <CardContent className="p-6 text-center">
                        <div className="w-14 h-14 rounded-full bg-bvbp-growth/10 flex items-center justify-center mx-auto mb-4">
                          <item.icon className="w-7 h-7 text-bvbp-growth" />
                        </div>
                        <h3 className="font-heading font-bold text-lg text-bvbp-corporate mb-2">{item.title}</h3>
                        <p className="text-muted-foreground text-sm">{item.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Próximos passos Section */}
          <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate text-center mb-12">
                  O que geralmente vem depois
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <Link to="/retainer-governanca">
                    <Card className="border-gray-200 hover:border-bvbp-growth/50 hover:shadow-md transition-all cursor-pointer h-full">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-bvbp-growth/10 flex items-center justify-center flex-shrink-0">
                            <Repeat className="w-6 h-6 text-bvbp-growth" />
                          </div>
                          <div>
                            <h3 className="font-heading font-bold text-lg text-bvbp-corporate mb-2">
                              Implementação de Governança de Execução
                            </h3>
                            <p className="text-muted-foreground text-sm">
                              Acompanhamento mensal para manter disciplina de execução, visibilidade e decisões — sem virar burocracia.
                            </p>
                            <span className="text-sm text-primary font-medium mt-2 inline-flex items-center gap-1">
                              Ver mais <ArrowRight className="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link to="/sprint-otimizacao">
                    <Card className="border-gray-200 hover:border-bvbp-growth/50 hover:shadow-md transition-all cursor-pointer h-full">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-bvbp-growth/10 flex items-center justify-center flex-shrink-0">
                            <Zap className="w-6 h-6 text-bvbp-growth" />
                          </div>
                          <div>
                            <h3 className="font-heading font-bold text-lg text-bvbp-corporate mb-2">
                              Sprints de Otimização adicionais
                            </h3>
                            <p className="text-muted-foreground text-sm">
                              Para fluxos que ficaram fora do escopo inicial ou surgiram depois da transformação.
                            </p>
                            <span className="text-sm text-primary font-medium mt-2 inline-flex items-center gap-1">
                              Ver mais <ArrowRight className="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate text-center mb-12">
                  Perguntas frequentes
                </h2>
                <Accordion type="single" collapsible className="space-y-4">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border border-gray-200 rounded-lg px-6">
                      <AccordionTrigger className="text-left font-heading font-semibold text-bvbp-corporate hover:text-bvbp-growth">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contato" className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-4">
                    Vamos desenhar seu programa
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Preencha o formulário para iniciarmos a conversa sobre seu Programa Customizado.
                  </p>
                </div>

                <Card className="border-0 shadow-soft">
                  <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome *</Label>
                          <Input 
                            id="name" 
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">E-mail *</Label>
                          <Input 
                            id="email" 
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            required 
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Telefone</Label>
                          <Input 
                            id="phone" 
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company">Empresa *</Label>
                          <Input 
                            id="company" 
                            value={formData.company}
                            onChange={(e) => handleInputChange('company', e.target.value)}
                            required 
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="role">Cargo</Label>
                          <Input 
                            id="role" 
                            value={formData.role}
                            onChange={(e) => handleInputChange('role', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="interest">Interesse *</Label>
                          <Select value={formData.interest} onValueChange={(value) => handleInputChange('interest', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Programa Customizado de Melhoria">Programa Customizado de Melhoria</SelectItem>
                              <SelectItem value="Diagnóstico Operacional">Diagnóstico Operacional</SelectItem>
                              <SelectItem value="Sprint de Otimização">Sprint de Otimização</SelectItem>
                              <SelectItem value="Gestão de Projetos">Gestão de Projetos</SelectItem>
                              <SelectItem value="Implementação de Governança de Execução">Implementação de Governança de Execução</SelectItem>
                              <SelectItem value="Outro">Outro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="challenge">Conte um pouco sobre o desafio</Label>
                        <Textarea 
                          id="challenge" 
                          placeholder="Quais fluxos estão travando? Quantas pessoas envolvidas? Já tentaram resolver antes?"
                          value={formData.challenge}
                          onChange={(e) => handleInputChange('challenge', e.target.value)}
                          rows={4}
                        />
                      </div>

                      <Button 
                        type="submit" 
                        variant="success" 
                        size="lg" 
                        className="w-full bg-bvbp-growth hover:bg-bvbp-growth/90"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Enviando..." : "Quero meu programa sob medida"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ProgramaCustomizadoPage;
