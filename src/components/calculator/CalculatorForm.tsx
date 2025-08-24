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
      "até 500k": 250000,
      "500k–2M": 1250000,
      "acima de 2M": 5000000
    }[formData.monthlyRevenue] || 250000;

    // Cálculo baseado na nova fórmula: faturamento × 20–30% × ajuste gargalos
    const baseLossPercentage = 0.25; // 25% médio entre 20-30%
    
    // Ajuste baseado nos gargalos (baixo=0.8, médio=1.0, alto=1.3)
    const bottleneckMultiplier = {
      "baixo": 0.8,
      "médio": 1.0,
      "alto": 1.3
    };

    const avgBottleneckLevel = [
      formData.reworkLevel || "médio",
      formData.firefightingLevel || "médio", 
      formData.meetingsLevel || "médio"
    ];
    
    const avgMultiplier = avgBottleneckLevel.reduce((sum, level) => 
      sum + (bottleneckMultiplier[level as keyof typeof bottleneckMultiplier] || 1.0), 0
    ) / 3;

    const totalMonthlyLoss = revenueValue * baseLossPercentage * avgMultiplier;
    const potentialSavings = totalMonthlyLoss * 0.35; // 30-40% de economia média (35%)

    return {
      monthlyLoss: Math.round(totalMonthlyLoss),
      potentialSavings: Math.round(potentialSavings)
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


  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Progress value={progress} className="mb-4" />
        <p className="text-center text-muted-foreground">
          Passo {currentStep} de {totalSteps}
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-center">
            {currentStep === 1 && "Passo 1 de 3: Dados Básicos"}
            {currentStep === 2 && "Passo 2 de 3: Gargalos Principais"}
            {currentStep === 3 && "Resultado"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nº de funcionários ({formData.employees || 10})
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
                <label className="block text-sm font-medium mb-2">Faturamento mensal</label>
                <Select value={formData.monthlyRevenue || ""} onValueChange={(value) => updateFormData({ monthlyRevenue: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o faturamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="até 500k">até 500k</SelectItem>
                    <SelectItem value="500k–2M">500k–2M</SelectItem>
                    <SelectItem value="acima de 2M">acima de 2M</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-8">
              <div>
                <label className="block text-lg font-medium mb-4">Retrabalho</label>
                <div className="grid grid-cols-3 gap-3">
                  {["baixo", "médio", "alto"].map((level) => (
                    <Button
                      key={level}
                      variant={formData.reworkLevel === level ? "default" : "outline"}
                      onClick={() => updateFormData({ reworkLevel: level })}
                      className="h-12 capitalize"
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium mb-4">Tempo da liderança em "apagar incêndios"</label>
                <div className="grid grid-cols-3 gap-3">
                  {["baixo", "médio", "alto"].map((level) => (
                    <Button
                      key={level}
                      variant={formData.firefightingLevel === level ? "default" : "outline"}
                      onClick={() => updateFormData({ firefightingLevel: level })}
                      className="h-12 capitalize"
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium mb-4">Reuniões improdutivas</label>
                <div className="grid grid-cols-3 gap-3">
                  {["baixo", "médio", "alto"].map((level) => (
                    <Button
                      key={level}
                      variant={formData.meetingsLevel === level ? "default" : "outline"}
                      onClick={() => updateFormData({ meetingsLevel: level })}
                      className="h-12 capitalize"
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && results && (
            <div className="space-y-8">
              {/* Resultado Principal */}
              <div className="text-center bg-gradient-subtle p-8 rounded-lg">
                <p className="text-lg mb-6">
                  Sua empresa pode estar perdendo até
                </p>
                <div className="text-5xl font-bold text-destructive mb-2">
                  R$ {results.monthlyLoss.toLocaleString()}
                </div>
                <p className="text-lg text-muted-foreground mb-6">
                  por mês com processos ineficientes
                </p>
                <p className="text-lg font-medium">
                  Nós ajudamos a recuperar isso em até 90 dias.
                </p>
              </div>

              {/* Economia Potencial */}
              <div className="text-center p-6 bg-success/10 rounded-lg">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="text-3xl">💰</div>
                  <div>
                    <div className="text-2xl font-bold text-success">
                      R$ {results.potentialSavings.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Potencial de economia mensal com BVBP
                    </div>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-4">
                <Button 
                  size="lg" 
                  className="w-full h-14 text-lg"
                  onClick={() => window.location.href = '/contato'}
                >
                  Agendar Conversa
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full h-14 text-lg"
                  onClick={() => window.location.href = '/contato'}
                >
                  Falar com Especialista
                </Button>
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
                  (currentStep === 1 && (!formData.employees || !formData.monthlyRevenue)) ||
                  (currentStep === 2 && (!formData.reworkLevel || !formData.firefightingLevel || !formData.meetingsLevel))
                }
                className="flex items-center gap-2"
              >
                Próximo
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default CalculatorForm;