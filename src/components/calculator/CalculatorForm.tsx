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
    if (!formData.employees || !formData.monthlyRevenue || !formData.averageSalary) return null;

    const revenueValue = {
      "até 50k": 25000,
      "50k–100k": 75000,
      "100k–500k": 300000,
      "500k–1M": 750000,
      "1M+": 2000000
    }[formData.monthlyRevenue] || 25000;

    // Cálculo de perdas baseado em horas perdidas e salário médio
    const monthlyWorkingHours = 160; // 40h/semana * 4 semanas
    const weeklyToMonthly = 4.33; // Para converter horas semanais em mensais
    
    // Custo por hora do funcionário (salário + encargos ~70%)
    const hourlyCost = (formData.averageSalary * 1.7) / monthlyWorkingHours;
    
    // Perdas por categoria
    const reworkLoss = (formData.reworkHours || 0) * weeklyToMonthly * hourlyCost * formData.employees;
    const meetingLoss = (formData.unproductiveMeetingHours || 0) * weeklyToMonthly * hourlyCost * formData.employees;
    const emergencyLoss = ((formData.emergencyTimePercentage || 0) / 100) * monthlyWorkingHours * hourlyCost * Math.min(formData.employees * 0.2, 10); // Apenas liderança
    
    const totalMonthlyLoss = reworkLoss + meetingLoss + emergencyLoss;
    const annualLoss = totalMonthlyLoss * 12;
    const revenuePercentage = (totalMonthlyLoss / revenueValue) * 100;
    const potentialSavings = totalMonthlyLoss * 0.35; // 35% de economia média

    return {
      monthlyLoss: Math.round(totalMonthlyLoss),
      annualLoss: Math.round(annualLoss),
      revenuePercentage: Math.round(revenuePercentage * 10) / 10, // 1 casa decimal
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
                  <SelectTrigger className="bg-background border-input">
                    <SelectValue placeholder="Selecione o faturamento" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-input z-50">
                    <SelectItem value="até 50k">até 50k</SelectItem>
                    <SelectItem value="50k–100k">50k–100k</SelectItem>
                    <SelectItem value="100k–500k">100k–500k</SelectItem>
                    <SelectItem value="500k–1M">500k–1M</SelectItem>
                    <SelectItem value="1M+">1M+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Salário médio mensal do time</label>
                <Select value={formData.averageSalary?.toString() || ""} onValueChange={(value) => updateFormData({ averageSalary: parseInt(value) })}>
                  <SelectTrigger className="bg-background border-input">
                    <SelectValue placeholder="Selecione a faixa salarial" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-input z-50">
                    <SelectItem value="3000">até R$ 3.000</SelectItem>
                    <SelectItem value="5000">R$ 3.000 - R$ 5.000</SelectItem>
                    <SelectItem value="8000">R$ 5.000 - R$ 8.000</SelectItem>
                    <SelectItem value="12000">R$ 8.000 - R$ 12.000</SelectItem>
                    <SelectItem value="18000">acima de R$ 12.000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-8">
              <div>
                <label className="block text-lg font-medium mb-4">
                  Retrabalho: {formData.reworkHours || 0}h por semana
                </label>
                <Slider
                  value={[formData.reworkHours || 0]}
                  onValueChange={([value]) => updateFormData({ reworkHours: value })}
                  max={200}
                  min={0}
                  step={5}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>0h</span>
                  <span>200h</span>
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium mb-4">
                  Reuniões improdutivas: {formData.unproductiveMeetingHours || 0}h por semana
                </label>
                <Slider
                  value={[formData.unproductiveMeetingHours || 0]}
                  onValueChange={([value]) => updateFormData({ unproductiveMeetingHours: value })}
                  max={20}
                  min={0}
                  step={1}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>0h</span>
                  <span>20h</span>
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium mb-4">
                  Tempo da liderança em emergências: {formData.emergencyTimePercentage || 0}%
                </label>
                <Slider
                  value={[formData.emergencyTimePercentage || 0]}
                  onValueChange={([value]) => updateFormData({ emergencyTimePercentage: value })}
                  max={100}
                  min={0}
                  step={5}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && results && (
            <div className="space-y-8">
              {/* 4 Blocos de Resultados */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-6 bg-destructive/10 rounded-lg border-l-4 border-destructive">
                  <h3 className="text-lg font-semibold mb-2">Perda Mensal Estimada</h3>
                  <div className="text-3xl font-bold text-destructive">
                    R$ {results.monthlyLoss.toLocaleString()}
                  </div>
                </div>

                <div className="text-center p-6 bg-destructive/10 rounded-lg border-l-4 border-destructive">
                  <h3 className="text-lg font-semibold mb-2">Perda Anual Estimada</h3>
                  <div className="text-3xl font-bold text-destructive">
                    R$ {results.annualLoss.toLocaleString()}
                  </div>
                </div>

                <div className="text-center p-6 bg-muted rounded-lg border-l-4 border-muted-foreground">
                  <h3 className="text-lg font-semibold mb-2">% do Faturamento</h3>
                  <div className="text-3xl font-bold text-muted-foreground">
                    {results.revenuePercentage}%
                  </div>
                </div>

                <div className="text-center p-6 bg-success/10 rounded-lg border-l-4 border-success">
                  <h3 className="text-lg font-semibold mb-2">Economia Potencial com BVBP</h3>
                  <div className="text-3xl font-bold text-success">
                    R$ {results.potentialSavings.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    em até 90 dias
                  </div>
                </div>
              </div>

              {/* Copy e CTA */}
              <div className="text-center space-y-6 bg-gradient-subtle p-8 rounded-lg">
                <p className="text-lg text-muted-foreground">
                  Esse é o dinheiro que sua empresa pode estar deixando na mesa todo mês. 
                  Quer entender como economizar e transformar em resultado real? Vamos conversar.
                </p>
                
                <Button 
                  size="lg" 
                  className="h-14 text-lg px-8"
                  onClick={() => window.location.href = '/contato'}
                >
                  Agendar Conversa
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
                  (currentStep === 1 && (!formData.employees || !formData.monthlyRevenue || !formData.averageSalary)) ||
                  (currentStep === 2 && (
                    formData.reworkHours === undefined || 
                    formData.unproductiveMeetingHours === undefined || 
                    formData.emergencyTimePercentage === undefined
                  ))
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