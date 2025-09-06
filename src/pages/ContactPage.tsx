import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MailIcon, PhoneIcon, MapPinIcon, ClockIcon, MessageCircleIcon, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";

const ContactPage = () => {
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
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  // Map URL slugs to select values
  const interestMap = {
    'transparencia': 'Transparência (diagnóstico gratuito)',
    'visao-de-futuro': 'Visão de Futuro',
    'implementacao-pratica': 'Implementação Prática',
    'automacao-inteligente': 'Automação Inteligente',
    'melhoria-continua': 'Melhoria Contínua',
    'radiografia-de-eficiencia': 'Radiografia de Eficiência',
    'governanca-de-reunioes': 'Governança de Reuniões',
    'planejamento-com-clareza': 'Planejamento com Clareza',
    'otimizacao-de-fluxo-de-valor': 'Otimização de Fluxo de Valor'
  };

  // Handle URL parameter pre-filling
  useEffect(() => {
    const interestParam = searchParams.get('interest');
    if (interestParam && interestMap[interestParam as keyof typeof interestMap]) {
      setFormData(prev => ({ 
        ...prev, 
        interest: interestMap[interestParam as keyof typeof interestMap] 
      }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission with email
    const emailSubject = `Novo contato BVBP – ${formData.interest || 'Contato geral'}`;
    const emailBody = `
      Nome: ${formData.name}
      Email: ${formData.email}
      Telefone: ${formData.phone}
      Empresa: ${formData.company}
      Cargo: ${formData.role}
      Serviço de interesse: ${formData.interest}
      Desafio: ${formData.challenge}
      
      UTM/Interest: ${searchParams.get('interest') || 'N/A'}
    `;
    
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
    <div className="min-h-screen">
      <Helmet>
        <title>Contato - BVBP | Fale Conosco Sobre Transformação de Processos</title>
        <meta name="description" content="Entre em contato com a BVBP. Resposta em até 4 horas úteis. Primeira conversa gratuita. Vamos conversar sobre como otimizar seus processos." />
      </Helmet>
      
      <Header />
      
      <main>
        <PageHero
          title="Fale Conosco"
          subtitle="Vamos conversar sobre sua transformação"
          description="Agende uma conversa sem compromisso. Entendemos seus desafios e propomos soluções práticas para sua realidade."
        >
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/20 text-white font-semibold backdrop-blur-sm">
            <MessageCircleIcon className="h-5 w-5 mr-2" />
            Primeira conversa sempre gratuita
          </div>
        </PageHero>

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
                          <SelectValue placeholder="Transparência" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-input z-50">
                          <SelectItem value="Transparência (diagnóstico gratuito)">Transparência (diagnóstico gratuito)</SelectItem>
                          <SelectItem value="Visão de Futuro">Visão de Futuro</SelectItem>
                          <SelectItem value="Implementação Prática">Implementação Prática</SelectItem>
                          <SelectItem value="Automação Inteligente">Automação Inteligente</SelectItem>
                          <SelectItem value="Melhoria Contínua">Melhoria Contínua</SelectItem>
                          <SelectItem value="Radiografia de Eficiência">Radiografia de Eficiência</SelectItem>
                          <SelectItem value="Governança de Reuniões">Governança de Reuniões</SelectItem>
                          <SelectItem value="Planejamento com Clareza">Planejamento com Clareza</SelectItem>
                          <SelectItem value="Otimização de Fluxo de Valor">Otimização de Fluxo de Valor</SelectItem>
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

                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="consent" className="rounded" required />
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

        {/* WhatsApp Section */}
        <section className="py-16 bg-bvbp-growth-light">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-6">
                Prefere Conversar pelo WhatsApp?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Clique no botão abaixo para iniciar uma conversa direta conosco
              </p>
              <Button 
                variant="hero" 
                size="xl"
                onClick={() => window.open('https://wa.me/5551996535711', '_blank')}
              >
                Falar pelo WhatsApp
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContactPage;