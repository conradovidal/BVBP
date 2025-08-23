import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MailIcon, PhoneIcon, MapPinIcon, ClockIcon, MessageCircleIcon, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    challenge: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Mensagem enviada com sucesso!",
        description: "Entraremos em contato em até 4 horas úteis.",
      });
      setIsSubmitting(false);
      setFormData({ name: "", email: "", company: "", phone: "", challenge: "" });
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const contactInfo = [
    {
      icon: MailIcon,
      title: "Email",
      info: "contato@bvbp.com.br",
      description: "Resposta em até 4 horas úteis"
    },
    {
      icon: PhoneIcon,
      title: "Telefone/WhatsApp", 
      info: "+55 51 99999-9999",
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
    <div className="min-h-screen">
      <Helmet>
        <title>Contato - BVBP | Fale Conosco Sobre Transformação de Processos</title>
        <meta name="description" content="Entre em contato com a BVBP. Resposta em até 4 horas úteis. Primeira conversa gratuita. Vamos conversar sobre como otimizar seus processos." />
      </Helmet>
      
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-16 lg:py-24 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-bvbp-corporate mb-6">
                Vamos Conversar
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                Conte-nos sobre seus desafios operacionais. Vamos descobrir juntos 
                como transformar sua operação em uma máquina de crescimento.
              </p>
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-bvbp-growth/10 text-bvbp-growth font-semibold">
                <MessageCircleIcon className="h-5 w-5 mr-2" />
                Primeira conversa sempre gratuita
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form & Info Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              
              {/* Contact Form */}
              <div>
                <Card className="p-8">
                  <div className="mb-6">
                    <h2 className="font-heading text-3xl font-bold text-bvbp-corporate mb-4">
                      Envie sua Mensagem
                    </h2>
                    <p className="text-muted-foreground">
                      Preencha o formulário abaixo e entraremos em contato em até 4 horas úteis
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="Seu nome completo"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Corporativo *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="seu@empresa.com.br"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company">Empresa *</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => handleInputChange("company", e.target.value)}
                          placeholder="Nome da sua empresa"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone/WhatsApp *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="+55 51 99999-9999"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Cargo/Função</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione seu cargo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ceo">CEO/Founder</SelectItem>
                          <SelectItem value="diretor">Diretor Operacional</SelectItem>
                          <SelectItem value="gerente">Gerente/Coordenador</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
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

                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="newsletter" className="rounded" />
                      <Label htmlFor="newsletter" className="text-sm text-muted-foreground">
                        Quero receber dicas de otimização por email
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
                  <h2 className="font-heading text-3xl font-bold text-bvbp-corporate mb-6">
                    Fale Direto Conosco
                  </h2>
                  
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
                              <h3 className="font-semibold text-bvbp-corporate mb-1">
                                {contact.title}
                              </h3>
                              <p className="text-lg font-medium text-foreground mb-1">
                                {contact.info}
                              </p>
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
                  <h3 className="font-heading text-xl font-bold text-bvbp-corporate mb-4">
                    Por Que Falar Conosco?
                  </h3>
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
                      <h3 className="font-semibold text-bvbp-corporate mb-2">
                        Horário de Atendimento
                      </h3>
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
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-bvbp-growth-light">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-6">
                Prefere Começar com Nosso Diagnóstico Gratuito?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Descubra exatamente onde sua empresa está perdendo dinheiro antes mesmo de conversar conosco
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="hero" 
                  size="xl"
                  onClick={() => {
                    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  FAZER DIAGNÓSTICO GRATUITO
                </Button>
                <Button variant="outline-hero" size="xl">
                  Ver Calculadora ROI
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContactPage;