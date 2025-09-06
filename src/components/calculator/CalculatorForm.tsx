import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, TrendingDown, DollarSign, BarChart3, Target, Calculator, Calendar, Clock, CheckCircle, ArrowRight } from "lucide-react";
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

  const totalSteps = 2;
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
    
    // Economia inicial (90 dias) = mensal × 30–50% (mais agressivo)
    const initialSavingsMin = monthlyWaste * 0.30;
    const initialSavingsMax = monthlyWaste * 0.50;
    
    // Economia sustentável (após capacitação) = mensal × 60–80% (potencial máximo)
    const sustainableSavingsMin = monthlyWaste * 0.60;
    const sustainableSavingsMax = monthlyWaste * 0.80;
    
    // ROI potencial no primeiro ano
    const roiMultiplier = 4;

    return {
      monthlyLoss: Math.round(monthlyWaste),
      annualLoss: Math.round(annualWaste),
      initialSavingsMin: Math.round(initialSavingsMin),
      initialSavingsMax: Math.round(initialSavingsMax),
      sustainableSavingsMin: Math.round(sustainableSavingsMin),
      sustainableSavingsMax: Math.round(sustainableSavingsMax),
      roiMultiplier,
      processType: formData.processType || "processo selecionado"
    };
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      if (currentStep === 1) {
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
      <div className="bg-white rounded-xl shadow-strong p-8 border-0 hover:shadow-soft transition-all duration-300">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-bvbp-corporate">
              {currentStep === 1 && "Preencha os dados da sua operação"}
              {currentStep === 2 && "Resultado Estimado"}
            </h2>
            <span className="text-sm text-muted-foreground font-semibold">
              Passo {currentStep} de {totalSteps}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div 
              className="bg-gradient-success h-3 rounded-full transition-all duration-500 shadow-soft"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <div className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-3 text-bvbp-corporate">Escolha o processo a avaliar</label>
                <Select value={formData.processType || ""} onValueChange={(value) => updateFormData({ processType: value })}>
                  <SelectTrigger className="bg-background border-input">
                    <SelectValue placeholder="Selecione o processo" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-input z-50">
                    <SelectItem value="Atendimento ao Cliente">Atendimento ao Cliente</SelectItem>
                    <SelectItem value="Vendas">Vendas</SelectItem>
                    <SelectItem value="Produção/Operação">Produção/Operação</SelectItem>
                    <SelectItem value="Reuniões de Liderança">Reuniões de Liderança</SelectItem>
                    <SelectItem value="Finanças/Administração">Finanças/Administração</SelectItem>
                    <SelectItem value="RH/People Ops">RH/People Ops</SelectItem>
                    <SelectItem value="TI/Sistemas">TI/Sistemas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3 text-bvbp-corporate">
                  Tamanho da equipe envolvida: <span className="font-bold text-bvbp-growth">{formData.teamSize || 1} pessoas</span>
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
                <label className="block text-sm font-semibold mb-3 text-bvbp-corporate">Salário médio mensal da equipe</label>
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
                <label className="block text-sm font-semibold mb-3 text-bvbp-corporate">
                  Tempo médio de retrabalho nesse processo: <span className="font-bold text-bvbp-growth">{formData.reworkHours || 0}h/semana por pessoa</span>
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
                <label className="block text-sm font-semibold mb-3 text-bvbp-corporate">
                  Tempo médio em reuniões improdutivas nesse processo: <span className="font-bold text-bvbp-growth">{formData.meetingHours || 0}h/semana por pessoa</span>
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

          {currentStep === 2 && results && (
            <div className="space-y-8">
              <div className="bg-gradient-subtle p-8 rounded-xl border-0 shadow-soft animate-fade-in">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-success mb-6 shadow-success">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-heading text-2xl md:text-3xl font-bold text-bvbp-corporate mb-4">
                    💡 Resultados Estimados
                  </h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="group bg-white p-6 rounded-xl border-0 shadow-soft hover:shadow-strong transition-all duration-300 hover:-translate-y-1">
                    <div className="text-sm text-muted-foreground mb-2 font-semibold">Perda Mensal Estimada</div>
                    <div className="text-3xl font-bold text-destructive group-hover:scale-105 transition-transform duration-300">
                      R$ {results.monthlyLoss.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="group bg-white p-6 rounded-xl border-0 shadow-soft hover:shadow-strong transition-all duration-300 hover:-translate-y-1">
                    <div className="text-sm text-muted-foreground mb-2 font-semibold">Perda Anual Estimada</div>
                    <div className="text-3xl font-bold text-destructive group-hover:scale-105 transition-transform duration-300">
                      R$ {results.annualLoss.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="group bg-white p-6 rounded-xl border-0 shadow-soft hover:shadow-strong transition-all duration-300 hover:-translate-y-1">
                    <div className="text-sm text-muted-foreground mb-2 font-semibold">Economia Inicial (90 dias)</div>
                    <div className="text-3xl font-bold text-bvbp-growth group-hover:scale-105 transition-transform duration-300">
                      R$ {results.initialSavingsMin.toLocaleString()} – {results.initialSavingsMax.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="group bg-white p-6 rounded-xl border-0 shadow-soft hover:shadow-strong transition-all duration-300 hover:-translate-y-1">
                    <div className="text-sm text-muted-foreground mb-2 font-semibold">Economia Sustentável (mensal)</div>
                    <div className="text-3xl font-bold text-bvbp-growth group-hover:scale-105 transition-transform duration-300">
                      R$ {results.sustainableSavingsMin.toLocaleString()} – {results.sustainableSavingsMax.toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-bvbp-growth rounded-xl">
                  <p className="text-white font-medium leading-relaxed">
                    <strong>Importante:</strong> Só no processo de <strong>{results.processType}</strong>, sua empresa pode estar perdendo cerca de R$ {results.monthlyLoss.toLocaleString()}/mês em retrabalho e reuniões improdutivas. Com a BVBP, é realista recuperar parte desse valor em até 90 dias.
                  </p>
                </div>
              </div>

              <div className="space-y-6 text-center">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    variant="hero"
                    size="xl"
                    onClick={() => window.location.href = '/contato?interesse=diagnostico'}
                    className="group shadow-strong"
                  >
                    Agendar Diagnóstico Gratuito
                    <CheckCircle className="h-5 w-5 ml-2 group-hover:scale-110 transition-transform" />
                  </Button>
                  
                  <Button 
                    variant="outline-hero"
                    size="xl"
                    onClick={() => window.location.href = '/servicos'}
                    className="hover:scale-105 transition-transform shadow-soft"
                  >
                    Conhecer Nossos Serviços
                    <ArrowRight className="h-5 w-5 ml-2" />
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
                variant="hero"
                onClick={nextStep}
                disabled={
                  !formData.processType || 
                  !formData.teamSize || 
                  !formData.averageSalary ||
                  formData.reworkHours === undefined || 
                  formData.meetingHours === undefined
                }
                className="flex items-center gap-2 shadow-strong"
              >
                Ver Resultado
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : null}
          </div>
        </div>
      </div>

    </div>
  );
};

export default CalculatorForm;