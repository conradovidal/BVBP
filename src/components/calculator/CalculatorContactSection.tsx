import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Send, Users, Target, Cog, Layers } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CalculatorResults, ProcessCalculatorData } from "./CalculatorForm";

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

interface CalculatorContactSectionProps {
  calculatorData?: Partial<ProcessCalculatorData>;
  results?: CalculatorResults | null;
}

const CalculatorContactSection = ({ calculatorData, results }: CalculatorContactSectionProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    interest: results && results.monthlyLoss > 50000 ? "Programa Customizado" : "Diagnóstico Operacional",
    challenge: results 
      ? `Identificamos uma perda estimada de R$ ${results.monthlyLoss.toLocaleString()}/mês no processo de ${results.processType}.` 
      : ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const { error } = await supabase.from('leads').insert({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      company: formData.company,
      role: formData.role || null,
      interest: formData.interest,
      challenge: formData.challenge || null,
      source: 'calculator',
      page_url: window.location.href,
      calculator_data: calculatorData && results ? {
        ...calculatorData,
        monthlyLoss: results.monthlyLoss,
        annualLoss: results.annualLoss
      } : null
    });
    
    if (error) {
      console.error('Error submitting lead:', error);
      toast({
        title: "Erro ao enviar",
        description: "Tente novamente ou entre em contato por e-mail.",
        variant: "destructive"
      });
    } else {
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
    }
    
    setIsSubmitting(false);
  };

  const isFormValid = formData.name && formData.email && formData.company && formData.interest;

  return (
    <section id="contato" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-bvbp-corporate mb-3 sm:mb-4">
            Qual o próximo passo?
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Escolha como prefere continuar: agende uma conversa ou explore nossos serviços
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 max-w-6xl mx-auto">
          {/* Left Column - Contact Form */}
          <div>
            <Card className="p-5 sm:p-6 lg:p-8 shadow-strong border-0 bg-white h-full">
              <div className="flex items-center gap-3 mb-5 sm:mb-6">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-bvbp-growth flex items-center justify-center shadow-success">
                  <Send className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-bvbp-corporate">
                    Agendar uma conversa
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Resposta em até 4 horas úteis
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                  className="w-full shadow-strong h-11 sm:h-12"
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
            <Card className="p-5 sm:p-6 lg:p-8 shadow-strong border-0 bg-white flex-1">
              <div className="flex items-center gap-3 mb-5 sm:mb-6">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-bvbp-corporate flex items-center justify-center">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-bvbp-corporate">
                    Conheça nossos serviços
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Entenda como podemos ajudar
                  </p>
                </div>
              </div>

              <p className="text-sm sm:text-base text-muted-foreground mb-5 sm:mb-6">
                Transformamos operações confusas em sistemas que funcionam. Escolha o serviço mais adequado para sua realidade:
              </p>

              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {services.map((service, index) => {
                  const Icon = service.icon;
                  return (
                    <div 
                      key={index}
                      className="group p-3.5 sm:p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-bvbp-growth hover:shadow-soft transition-all duration-300 cursor-pointer active:scale-[0.98]"
                      onClick={() => {
                        if (service.link) {
                          navigate(service.link);
                        } else {
                          navigate("/#servicos");
                        }
                      }}
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white group-hover:bg-bvbp-growth/10 flex items-center justify-center transition-colors border border-gray-100 group-hover:border-bvbp-growth/20 flex-shrink-0">
                          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-bvbp-corporate group-hover:text-bvbp-growth transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-semibold text-sm sm:text-base text-bvbp-corporate group-hover:text-bvbp-growth transition-colors truncate">
                              {service.title}
                            </h4>
                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-bvbp-growth group-hover:translate-x-1 transition-all flex-shrink-0" />
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground">
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
                className="w-full border-bvbp-corporate text-bvbp-corporate hover:bg-bvbp-corporate hover:text-white transition-all h-11 sm:h-12"
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
