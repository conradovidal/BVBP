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
import { toast } from "@/hooks/use-toast";

interface ProcessCalculatorData {
  processType: string;
  teamSize: number;
  averageSalary: number;
  reworkHours: number;
  meetingHours: number;
}

interface CalculatorFormProps {
  onDataUpdate: (data: Partial<ProcessCalculatorData>) => void;
  onCalculationComplete: () => void;
  calculatorData: Partial<ProcessCalculatorData>;
}

const CalculatorForm = ({ onDataUpdate, onCalculationComplete, calculatorData }: CalculatorFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<ProcessCalculatorData>>(calculatorData);
  const [results, setResults] = useState<any>(null);

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (updates: Partial<ProcessCalculatorData>) => {
    const newData = { ...formData, ...updates };
    setFormData(newData);
    onDataUpdate(newData);
  };

  const calculateResults = () => {
    if (!formData.teamSize || !formData.averageSalary) return null;

    // Custo/hora = salário médio ÷ 160
    const hourlyCost = formData.averageSalary / 160;
    
    // Retrabalho = equipe × horas retrabalho × 4 × custo/hora
    const reworkLoss = formData.teamSize * (formData.reworkHours || 0) * 4 * hourlyCost;
    
    // Reuniões = equipe × horas reuniões × 4 × custo/hora
    const meetingLoss = formData.teamSize * (formData.meetingHours || 0) * 4 * hourlyCost;
    
    // Desperdício mensal = Retrabalho + Reuniões
    const monthlyWaste = reworkLoss + meetingLoss;
    
    // Desperdício anual = mensal × 12
    const annualWaste = monthlyWaste * 12;
    
    // Economia potencial = mensal × 20–40% (mostrar faixa no resultado)
    const savingsMin = monthlyWaste * 0.20;
    const savingsMax = monthlyWaste * 0.40;

    return {
      monthlyLoss: Math.round(monthlyWaste),
      annualLoss: Math.round(annualWaste),
      savingsMin: Math.round(savingsMin),
      savingsMax: Math.round(savingsMax),
      processType: formData.processType || "processo selecionado"
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
            {currentStep === 1 && "Passo 1 de 3: Escolha o processo a avaliar"}
            {currentStep === 2 && "Passo 2 de 3: Detalhes do processo"}
            {currentStep === 3 && "Resultado estimado"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Escolha o processo a avaliar</label>
                <Select value={formData.processType || ""} onValueChange={(value) => updateFormData({ processType: value })}>
                  <SelectTrigger className="bg-background border-input">
                    <SelectValue placeholder="Selecione o processo" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-input z-50">
                    <SelectItem value="Atendimento ao cliente">Atendimento ao cliente</SelectItem>
                    <SelectItem value="Vendas">Vendas</SelectItem>
                    <SelectItem value="Produção/Operação">Produção/Operação</SelectItem>
                    <SelectItem value="Reuniões de liderança">Reuniões de liderança</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tamanho da equipe envolvida: {formData.teamSize || 1} pessoas
                </label>
                <Slider
                  value={[formData.teamSize || 1]}
                  onValueChange={([value]) => updateFormData({ teamSize: value })}
                  max={50}
                  min={1}
                  step={1}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>1</span>
                  <span>50</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Salário médio mensal da equipe</label>
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

              <div>
                <label className="block text-sm font-medium mb-2">
                  Tempo médio de retrabalho nesse processo: {formData.reworkHours || 0}h/semana por pessoa
                </label>
                <Slider
                  value={[formData.reworkHours || 0]}
                  onValueChange={([value]) => updateFormData({ reworkHours: value })}
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
                <label className="block text-sm font-medium mb-2">
                  Tempo médio em reuniões improdutivas nesse processo: {formData.meetingHours || 0}h/semana por pessoa
                </label>
                <Slider
                  value={[formData.meetingHours || 0]}
                  onValueChange={([value]) => updateFormData({ meetingHours: value })}
                  max={10}
                  min={0}
                  step={1}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>0h</span>
                  <span>10h</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && results && (
            <div className="space-y-8">
              {/* Copy principal */}
              <div className="text-center space-y-4 p-6 bg-gradient-subtle rounded-lg">
                <div className="flex justify-center items-center gap-2 text-2xl">
                  <span>💸</span>
                  <span className="font-bold">PERDAS</span>
                  <span>📈</span>
                  <span className="font-bold">ECONOMIA</span>
                </div>
                <p className="text-lg text-muted-foreground">
                  Só no processo de <strong>{results.processType}</strong>, sua empresa pode estar perdendo cerca de{" "}
                  <span className="text-destructive font-bold">R$ {results.monthlyLoss.toLocaleString()}/mês</span>{" "}
                  (<span className="text-destructive font-bold">R$ {results.annualLoss.toLocaleString()}/ano</span>) em retrabalho e reuniões improdutivas.
                </p>
                <p className="text-lg text-muted-foreground">
                  Com a BVBP, é realista recuperar entre{" "}
                  <span className="text-success font-bold">R$ {results.savingsMin.toLocaleString()}</span> e{" "}
                  <span className="text-success font-bold">R$ {results.savingsMax.toLocaleString()}</span> por mês em até 90 dias.
                </p>
                <p className="text-lg text-muted-foreground">
                  <strong>👉 Esse é apenas um processo — imagine o impacto na sua operação completa.</strong>
                </p>
              </div>

              {/* Blocos de resultados */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-6 bg-destructive/10 rounded-lg border-l-4 border-destructive">
                  <h3 className="text-lg font-semibold mb-2">💸 Perda Mensal Estimada</h3>
                  <div className="text-3xl font-bold text-destructive">
                    R$ {results.monthlyLoss.toLocaleString()}
                  </div>
                </div>

                <div className="text-center p-6 bg-destructive/10 rounded-lg border-l-4 border-destructive">
                  <h3 className="text-lg font-semibold mb-2">💸 Perda Anual Estimada</h3>
                  <div className="text-3xl font-bold text-destructive">
                    R$ {results.annualLoss.toLocaleString()}
                  </div>
                </div>

                <div className="text-center p-6 bg-success/10 rounded-lg border-l-4 border-success">
                  <h3 className="text-lg font-semibold mb-2">📈 Economia Potencial (Mín)</h3>
                  <div className="text-3xl font-bold text-success">
                    R$ {results.savingsMin.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    em até 90 dias
                  </div>
                </div>

                <div className="text-center p-6 bg-success/10 rounded-lg border-l-4 border-success">
                  <h3 className="text-lg font-semibold mb-2">📈 Economia Potencial (Máx)</h3>
                  <div className="text-3xl font-bold text-success">
                    R$ {results.savingsMax.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    em até 90 dias
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center space-y-4 p-6 bg-gradient-subtle rounded-lg">
                <Button 
                  size="lg" 
                  className="h-14 text-lg px-8 bg-success hover:bg-success/90 text-background transition-all duration-300 hover:scale-105"
                  onClick={() => window.location.href = '/contato'}
                >
                  Agendar Diagnóstico Gratuito
                </Button>
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="h-12 text-base px-6"
                    onClick={() => window.location.href = '/servicos'}
                  >
                    Quer entender como resolver essa dor na prática? Veja nossos serviços.
                  </Button>
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
                  (currentStep === 1 && !formData.processType) ||
                  (currentStep === 2 && (
                    !formData.teamSize || 
                    !formData.averageSalary ||
                    formData.reworkHours === undefined || 
                    formData.meetingHours === undefined
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