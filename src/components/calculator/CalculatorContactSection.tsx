import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Send, CheckCircle, Users, Target, Cog, Shield, Layers } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const services = [
  { 
    title: "Diagnóstico Operacional", 
    duration: "2-3 semanas",
    icon: Target,
    link: "/diagnostico-operacional"
  },
  { 
    title: "Sprint de Otimização de Processo", 
    duration: "4-6 semanas",
    icon: Cog,
    link: null
  },
  { 
    title: "Programa Customizado de Melhoria", 
    duration: "Sob demanda",
    icon: Layers,
    link: null
  },
];

const CalculatorContactSection = () => {
  const navigate = useNavigate();
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Mensagem enviada!",
      description: "Entraremos em contato em até 4 horas úteis.",
    });
    
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      role: "",
      interest: "",
      challenge: ""
    });
    setIsSubmitting(false);
  };

  const isFormValid = formData.name && formData.email && formData.company && formData.interest;

  return (
    <section id="contato" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-4">
            Qual o próximo passo?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Escolha como prefere continuar: agende uma conversa ou explore nossos serviços
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Left Column - Contact Form */}
          <div>
            <Card className="p-8 shadow-strong border-0 bg-white h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-success flex items-center justify-center shadow-success">
                  <Send className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-bvbp-corporate">
                    Agendar uma conversa
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Resposta em até 4 horas úteis
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      placeholder="Seu nome *"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="h-11 bg-gray-50 border-gray-200 focus:border-bvbp-growth focus:ring-bvbp-growth/20"
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Seu e-mail *"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="h-11 bg-gray-50 border-gray-200 focus:border-bvbp-growth focus:ring-bvbp-growth/20"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      placeholder="Telefone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="h-11 bg-gray-50 border-gray-200 focus:border-bvbp-growth focus:ring-bvbp-growth/20"
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Empresa *"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      className="h-11 bg-gray-50 border-gray-200 focus:border-bvbp-growth focus:ring-bvbp-growth/20"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Input
                    placeholder="Seu cargo"
                    value={formData.role}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                    className="h-11 bg-gray-50 border-gray-200 focus:border-bvbp-growth focus:ring-bvbp-growth/20"
                  />
                </div>

                <div>
                  <Select 
                    value={formData.interest} 
                    onValueChange={(value) => handleInputChange("interest", value)}
                  >
                    <SelectTrigger className="h-11 bg-gray-50 border-gray-200 focus:border-bvbp-growth focus:ring-bvbp-growth/20">
                      <SelectValue placeholder="Interesse *" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 z-50">
                      <SelectItem value="Diagnóstico Operacional">Diagnóstico Operacional</SelectItem>
                      <SelectItem value="Otimização de Processos">Otimização de Processos</SelectItem>
                      <SelectItem value="Gestão de Projetos">Gestão de Projetos</SelectItem>
                      <SelectItem value="Governança e Execução">Governança e Execução</SelectItem>
                      <SelectItem value="Programa Customizado">Programa Customizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Textarea
                    placeholder="Conte brevemente seu principal desafio operacional..."
                    value={formData.challenge}
                    onChange={(e) => handleInputChange("challenge", e.target.value)}
                    className="min-h-[100px] bg-gray-50 border-gray-200 focus:border-bvbp-growth focus:ring-bvbp-growth/20 resize-none"
                  />
                </div>

                <Button 
                  type="submit" 
                  variant="hero" 
                  size="lg" 
                  className="w-full shadow-strong"
                  disabled={!isFormValid || isSubmitting}
                >
                  {isSubmitting ? (
                    <>Enviando...</>
                  ) : (
                    <>
                      Enviar Mensagem
                      <Send className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>

          {/* Right Column - Services */}
          <div className="flex flex-col">
            <Card className="p-8 shadow-strong border-0 bg-white flex-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-bvbp-corporate flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-bvbp-corporate">
                    Conheça nossos serviços
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Entenda como podemos ajudar
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground mb-6">
                Transformamos operações confusas em sistemas que funcionam. Escolha o serviço mais adequado para sua realidade:
              </p>

              <div className="space-y-4 mb-8">
                {services.map((service, index) => {
                  const Icon = service.icon;
                  return (
                    <div 
                      key={index}
                      className="group p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-bvbp-growth hover:shadow-soft transition-all duration-300 cursor-pointer"
                      onClick={() => {
                        if (service.link) {
                          navigate(service.link);
                        } else {
                          navigate("/#servicos");
                        }
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white group-hover:bg-bvbp-growth/10 flex items-center justify-center transition-colors border border-gray-100 group-hover:border-bvbp-growth/20">
                          <Icon className="h-5 w-5 text-bvbp-corporate group-hover:text-bvbp-growth transition-colors" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-bvbp-corporate group-hover:text-bvbp-growth transition-colors">
                              {service.title}
                            </h4>
                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-bvbp-growth group-hover:translate-x-1 transition-all" />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Duração: {service.duration}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Button 
                variant="outline" 
                size="lg" 
                className="w-full border-bvbp-corporate text-bvbp-corporate hover:bg-bvbp-corporate hover:text-white transition-all"
                onClick={() => navigate("/#servicos")}
              >
                Ver todos os serviços
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalculatorContactSection;