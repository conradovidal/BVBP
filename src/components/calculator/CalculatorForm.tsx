import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CalculatorData } from "@/pages/CalculatorPage";
import { toast } from "@/hooks/use-toast";

interface CalculatorFormProps {
  onDataUpdate: (data: Partial<CalculatorData>) => void;
  onCalculationComplete: () => void;
  calculatorData: Partial<CalculatorData>;
}

const CalculatorForm = ({ onDataUpdate, onCalculationComplete, calculatorData }: CalculatorFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CalculatorData>>(calculatorData);
  const [results, setResults] = useState<any>(null);

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (updates: Partial<CalculatorData>) => {
    const newData = { ...formData, ...updates };
    setFormData(newData);
    onDataUpdate(newData);
  };

  const calculateResults = () => {
    if (!formData.employees || !formData.monthlyRevenue) return null;

    const revenueValue = {
      "R$ 500k - R$ 1M": 750000,
      "R$ 1M - R$ 5M": 3000000,
      "R$ 5M - R$ 10M": 7500000,
      "R$ 10M - R$ 50M": 30000000,
      "Acima de R$ 50M": 75000000
    }[formData.monthlyRevenue] || 750000;

    const avgSalary = revenueValue * 0.002;

    // Cálculos baseados nas fórmulas especificadas
    const reworkLoss = (formData.reworkHours || 0) * formData.employees * avgSalary * 4.33;
    const meetingLoss = (formData.unproductiveMeetings || 0) * 1.5 * formData.employees * 0.7 * avgSalary * 4.33;
    const firefightingLoss = (formData.firefightingPercentage || 0) * revenueValue * 0.0015;
    
    const delayMultiplier = {
      "Raramente (< 10%)": 0.1,
      "Às vezes (10-30%)": 0.2,
      "Frequentemente (30-60%)": 0.45,
      "Sempre (> 60%)": 0.7
    }[formData.missedDeadlines || ""] || 0.1;
    
    const delayLoss = delayMultiplier * revenueValue * 0.05;
    const decisionLoss = (11 - (formData.decisionSpeed || 5)) * revenueValue * 0.01;
    const integrationLoss = (formData.nonIntegratedSystems || 0) * formData.employees * 2 * avgSalary * 4.33;

    const totalMonthlyLoss = reworkLoss + meetingLoss + firefightingLoss + delayLoss + decisionLoss + integrationLoss;

    return {
      monthlyLoss: Math.round(totalMonthlyLoss),
      annualLoss: Math.round(totalMonthlyLoss * 12),
      potentialSavings: Math.round(totalMonthlyLoss * 0.35),
      roiEstimated: Math.round(((totalMonthlyLoss * 0.35 * 12) / 15000) * 100)
    };
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      if (currentStep === 2) {
        const calculatedResults = calculateResults();
        setResults(calculatedResults);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Relatório sendo gerado!",
      description: "Você receberá seu relatório personalizado por email em instantes.",
    });

    onCalculationComplete();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Progress value={progress} className="mb-4" />
        <p className="text-center text-muted-foreground">
          Progresso: {Math.round(progress)}% completo • Faltam apenas {totalSteps - currentStep + 1} minutos para seu relatório
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-center">
            {currentStep === 1 && "Informações Básicas da Empresa"}
            {currentStep === 2 && "Diagnóstico Operacional"}
            {currentStep === 3 && "Seus Resultados & Contato"}
          </CardTitle>
          {currentStep === 2 && (
            <p className="text-center text-muted-foreground">
              Responda com honestidade - ninguém está julgando 😉
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Qual o nome da sua empresa?</label>
                <Input
                  value={formData.companyName || ""}
                  onChange={(e) => updateFormData({ companyName: e.target.value })}
                  placeholder="Nome da empresa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Quantos funcionários? ({formData.employees || 10})
                </label>
                <Slider
                  value={[formData.employees || 10]}
                  onValueChange={([value]) => updateFormData({ employees: value })}
                  max={500}
                  min={10}
                  step={5}
                  className="mb-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Qual faturamento mensal aproximado?</label>
                <Select value={formData.monthlyRevenue || ""} onValueChange={(value) => updateFormData({ monthlyRevenue: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o faturamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="R$ 500k - R$ 1M">R$ 500k - R$ 1M</SelectItem>
                    <SelectItem value="R$ 1M - R$ 5M">R$ 1M - R$ 5M</SelectItem>
                    <SelectItem value="R$ 5M - R$ 10M">R$ 5M - R$ 10M</SelectItem>
                    <SelectItem value="R$ 10M - R$ 50M">R$ 10M - R$ 50M</SelectItem>
                    <SelectItem value="Acima de R$ 50M">Acima de R$ 50M</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Quantas horas por semana seu time gasta REFAZENDO trabalho? ({formData.reworkHours || 0}h)
                </label>
                <Slider
                  value={[formData.reworkHours || 0]}
                  onValueChange={([value]) => updateFormData({ reworkHours: value })}
                  max={40}
                  min={0}
                  step={1}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Quantas reuniões por semana acontecem sem objetivo claro? ({formData.unproductiveMeetings || 0})
                </label>
                <Slider
                  value={[formData.unproductiveMeetings || 0]}
                  onValueChange={([value]) => updateFormData({ unproductiveMeetings: value })}
                  max={50}
                  min={0}
                  step={1}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Quantos % do tempo da liderança é gasto "apagando incêndios"? ({formData.firefightingPercentage || 0}%)
                </label>
                <Slider
                  value={[formData.firefightingPercentage || 0]}
                  onValueChange={([value]) => updateFormData({ firefightingPercentage: value })}
                  max={100}
                  min={0}
                  step={5}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Com que frequência prazos importantes são perdidos?</label>
                <Select value={formData.missedDeadlines || ""} onValueChange={(value) => updateFormData({ missedDeadlines: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a frequência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Raramente (< 10%)">Raramente (&lt; 10%)</SelectItem>
                    <SelectItem value="Às vezes (10-30%)">Às vezes (10-30%)</SelectItem>
                    <SelectItem value="Frequentemente (30-60%)">Frequentemente (30-60%)</SelectItem>
                    <SelectItem value="Sempre (> 60%)">Sempre (&gt; 60%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Quão difícil é tomar decisões importantes na sua empresa? (Escala 1-10: {formData.decisionSpeed || 5})
                </label>
                <Slider
                  value={[formData.decisionSpeed || 5]}
                  onValueChange={([value]) => updateFormData({ decisionSpeed: value })}
                  max={10}
                  min={1}
                  step={1}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Quantos sistemas/ferramentas diferentes vocês usam que NÃO conversam entre si? ({formData.nonIntegratedSystems || 0})
                </label>
                <Slider
                  value={[formData.nonIntegratedSystems || 0]}
                  onValueChange={([value]) => updateFormData({ nonIntegratedSystems: value })}
                  max={20}
                  min={0}
                  step={1}
                />
              </div>
            </div>
          )}

          {currentStep === 3 && results && (
            <div className="space-y-6">
              {/* Resultados */}
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <div className="p-6 bg-destructive/10 rounded-lg text-center">
                  <div className="text-3xl font-bold text-destructive mb-2">
                    R$ {results.monthlyLoss.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">💸 Perda Mensal Estimada</div>
                </div>

                <div className="p-6 bg-success/10 rounded-lg text-center">
                  <div className="text-3xl font-bold text-success mb-2">
                    R$ {results.potentialSavings.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">⚡ Potencial Economia BVBP</div>
                </div>

                <div className="p-6 bg-muted rounded-lg text-center">
                  <div className="text-3xl font-bold text-foreground mb-2">
                    R$ {results.annualLoss.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">📈 Perda Anual Projetada</div>
                </div>

                <div className="p-6 bg-primary/10 rounded-lg text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {results.roiEstimated}%
                  </div>
                  <div className="text-sm text-muted-foreground">🎯 ROI Estimado</div>
                </div>
              </div>

              {/* Formulário de contato */}
              <div className="bg-gradient-subtle p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-center">
                  Receba Seu Relatório Personalizado Gratuito
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nome Completo*</label>
                    <Input
                      value={formData.name || ""}
                      onChange={(e) => updateFormData({ name: e.target.value })}
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email Corporativo*</label>
                    <Input
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) => updateFormData({ email: e.target.value })}
                      placeholder="seu@empresa.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Telefone/WhatsApp*</label>
                    <Input
                      value={formData.phone || ""}
                      onChange={(e) => updateFormData({ phone: e.target.value })}
                      placeholder="(11) 99999-9999"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Cargo/Função</label>
                    <Select value={formData.position || ""} onValueChange={(value) => updateFormData({ position: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione seu cargo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CEO/Founder">CEO/Founder</SelectItem>
                        <SelectItem value="Diretor Operacional">Diretor Operacional</SelectItem>
                        <SelectItem value="Gerente/Coordenador">Gerente/Coordenador</SelectItem>
                        <SelectItem value="Outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Maior desafio operacional atual?</label>
                  <Textarea
                    value={formData.mainChallenge || ""}
                    onChange={(e) => updateFormData({ mainChallenge: e.target.value })}
                    placeholder="Descreva brevemente seu maior desafio..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2 mb-6">
                  <Checkbox 
                    id="updates"
                    checked={formData.wantsUpdates || false}
                    onCheckedChange={(checked) => updateFormData({ wantsUpdates: !!checked })}
                  />
                  <label htmlFor="updates" className="text-sm text-muted-foreground">
                    Quero receber dicas de otimização por email
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Voltar
            </Button>

            {currentStep < totalSteps ? (
              <Button 
                onClick={nextStep}
                disabled={
                  (currentStep === 1 && (!formData.companyName || !formData.employees || !formData.monthlyRevenue)) ||
                  (currentStep === 2 && typeof formData.reworkHours === 'undefined')
                }
                className="flex items-center gap-2"
              >
                Próximo
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                variant="success"
                size="lg"
                className="flex items-center gap-2"
              >
                GERAR MEU RELATÓRIO GRATUITO
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {currentStep === 2 && (
        <div className="text-center p-6 bg-muted/50 rounded-lg">
          <p className="text-lg font-medium text-muted-foreground">
            {formData.reworkHours && formData.reworkHours > 10 && "😱 Sua empresa pode estar perdendo mais que 67% das empresas similares"}
            {formData.unproductiveMeetings && formData.unproductiveMeetings > 15 && "🎯 Você está descobrindo oportunidades valiosas!"}
          </p>
        </div>
      )}
    </div>
  );
};

export default CalculatorForm;