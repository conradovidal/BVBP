import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ChevronLeft, ChevronRight, Target, Users, DollarSign, Clock, MessageSquare, Sparkles, TrendingUp, AlertTriangle } from "lucide-react";

export interface ProcessCalculatorData {
  processType: string;
  teamSize: number;
  averageSalary: number;
  reworkHours: number;
  meetingHours: number;
}

export interface CalculatorResults {
  monthlyLoss: number;
  annualLoss: number;
  initialSavingsMin: number;
  initialSavingsMax: number;
  sustainableSavingsMin: number;
  sustainableSavingsMax: number;
  processType: string;
}

interface CalculatorFormProps {
  onDataUpdate: (data: Partial<ProcessCalculatorData>) => void;
  onCalculationComplete: (results: CalculatorResults) => void;
  calculatorData: Partial<ProcessCalculatorData>;
}

// Logarithmic scale functions - smaller numbers take more space on the slider
const valueToSliderPosition = (value: number, min: number, max: number) => {
  if (value <= min) return 0;
  if (value >= max) return 100;
  const logMin = Math.log(min);
  const logMax = Math.log(max);
  const logValue = Math.log(value);
  return ((logValue - logMin) / (logMax - logMin)) * 100;
};

const sliderPositionToValue = (position: number, min: number, max: number) => {
  if (position <= 0) return min;
  if (position >= 100) return max;
  const logMin = Math.log(min);
  const logMax = Math.log(max);
  const logValue = logMin + (position / 100) * (logMax - logMin);
  return Math.round(Math.exp(logValue));
};

// Slider configs
const sliderConfigs = {
  teamSize: { min: 1, max: 50, marks: [1, 5, 10, 20, 50] },
  reworkHours: { min: 1, max: 20, marks: [1, 3, 5, 10, 20] },
  meetingHours: { min: 1, max: 10, marks: [1, 2, 4, 6, 10] }
};

const CalculatorForm = ({ onDataUpdate, onCalculationComplete, calculatorData }: CalculatorFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<ProcessCalculatorData>>({
    teamSize: calculatorData.teamSize || 5,
    reworkHours: calculatorData.reworkHours || 3,
    meetingHours: calculatorData.meetingHours || 2,
    ...calculatorData
  });
  const [results, setResults] = useState<CalculatorResults | null>(null);

  const totalSteps = 2;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (updates: Partial<ProcessCalculatorData>) => {
    const newData = { ...formData, ...updates };
    setFormData(newData);
    onDataUpdate(newData);
  };

  const calculateResults = (): CalculatorResults | null => {
    if (!formData.teamSize || !formData.averageSalary) return null;

    const hourlyCost = formData.averageSalary / 160;
    const reworkLoss = formData.teamSize * (formData.reworkHours || 0) * 4 * hourlyCost;
    const meetingLoss = formData.teamSize * (formData.meetingHours || 0) * 4 * hourlyCost;
    const monthlyWaste = reworkLoss + meetingLoss;
    const annualWaste = monthlyWaste * 12;
    const initialSavingsMin = monthlyWaste * 0.30;
    const initialSavingsMax = monthlyWaste * 0.50;
    const sustainableSavingsMin = monthlyWaste * 0.60;
    const sustainableSavingsMax = monthlyWaste * 0.80;

    return {
      monthlyLoss: Math.round(monthlyWaste),
      annualLoss: Math.round(annualWaste),
      initialSavingsMin: Math.round(initialSavingsMin),
      initialSavingsMax: Math.round(initialSavingsMax),
      sustainableSavingsMin: Math.round(sustainableSavingsMin),
      sustainableSavingsMax: Math.round(sustainableSavingsMax),
      processType: formData.processType || "processo selecionado"
    };
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      if (currentStep === 1) {
        const calculatedResults = calculateResults();
        setResults(calculatedResults);
        if (calculatedResults) {
          onCalculationComplete(calculatedResults);
        }
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isFormComplete = 
    formData.processType && 
    formData.teamSize && 
    formData.averageSalary &&
    formData.reworkHours !== undefined && 
    formData.meetingHours !== undefined;

  const renderSliderWithMarks = (
    value: number,
    onChange: (val: number) => void,
    config: typeof sliderConfigs.teamSize,
    label: string,
    unit: string
  ) => {
    const sliderPosition = valueToSliderPosition(value, config.min, config.max);
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span className="text-lg font-bold text-bvbp-corporate bg-bvbp-growth/10 px-3 py-1 rounded-full">
            {value} {unit}
          </span>
        </div>
        <div className="px-1">
          <Slider
            value={[sliderPosition]}
            onValueChange={(vals) => {
              const newValue = sliderPositionToValue(vals[0], config.min, config.max);
              onChange(newValue);
            }}
            max={100}
            step={1}
            className="cursor-pointer"
          />
          {/* Marks - positioned using logarithmic scale */}
          <div className="relative mt-2 h-5">
            {config.marks.map((mark) => {
              const position = valueToSliderPosition(mark, config.min, config.max);
              return (
                <span
                  key={mark}
                  className={`absolute text-xs transform -translate-x-1/2 ${
                    value === mark 
                      ? 'text-bvbp-growth font-semibold' 
                      : 'text-muted-foreground'
                  }`}
                  style={{ left: `${position}%` }}
                >
                  {mark}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-0">
      <Card className="p-5 sm:p-8 md:p-10 shadow-strong border-0 bg-white">
        {/* Progress Header */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-bvbp-growth flex items-center justify-center shadow-success">
                {currentStep === 1 ? (
                  <Target className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                ) : (
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                )}
              </div>
              <div>
                <h2 className="font-heading text-lg sm:text-xl md:text-2xl font-bold text-bvbp-corporate">
                  {currentStep === 1 && "Dados da sua operação"}
                  {currentStep === 2 && "Seu resultado estimado"}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {currentStep === 1 && "Preencha as informações abaixo"}
                  {currentStep === 2 && "Análise baseada nos dados informados"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground bg-muted px-3 py-1.5 sm:px-4 sm:py-2 rounded-full">
              <span className="text-bvbp-growth font-bold">{currentStep}</span>
              <span>/</span>
              <span>{totalSteps}</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-bvbp-growth h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step 1 - Form Fields */}
        {currentStep === 1 && (
          <div className="space-y-6 sm:space-y-8 animate-fade-in">
            {/* Processo */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold mb-3 text-bvbp-corporate group-hover:text-bvbp-growth transition-colors">
                <Target className="h-4 w-4" />
                Qual processo você quer avaliar?
              </label>
              <Select 
                value={formData.processType || ""} 
                onValueChange={(value) => updateFormData({ processType: value })}
              >
                <SelectTrigger className="h-12 text-base bg-gray-50 border-gray-200 hover:border-bvbp-growth hover:bg-white transition-all focus:ring-2 focus:ring-bvbp-growth/20">
                  <SelectValue placeholder="Selecione o processo" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 z-50">
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

            {/* Tamanho da Equipe - Slider */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold mb-4 text-bvbp-corporate group-hover:text-bvbp-growth transition-colors">
                <Users className="h-4 w-4" />
                Tamanho da equipe envolvida
              </label>
              {renderSliderWithMarks(
                formData.teamSize || 5,
                (val) => updateFormData({ teamSize: val }),
                sliderConfigs.teamSize,
                "Pessoas na equipe",
                "pessoas"
              )}
            </div>

            {/* Salário Médio */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold mb-3 text-bvbp-corporate group-hover:text-bvbp-growth transition-colors">
                <DollarSign className="h-4 w-4" />
                Salário médio mensal da equipe
              </label>
              <Select 
                value={formData.averageSalary?.toString() || ""} 
                onValueChange={(value) => updateFormData({ averageSalary: parseInt(value) })}
              >
                <SelectTrigger className="h-12 text-base bg-gray-50 border-gray-200 hover:border-bvbp-growth hover:bg-white transition-all focus:ring-2 focus:ring-bvbp-growth/20">
                  <SelectValue placeholder="Selecione a faixa salarial" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 z-50">
                  <SelectItem value="3000">até R$ 3.000</SelectItem>
                  <SelectItem value="5000">R$ 3.000 - R$ 5.000</SelectItem>
                  <SelectItem value="8000">R$ 5.000 - R$ 8.000</SelectItem>
                  <SelectItem value="12000">R$ 8.000 - R$ 12.000</SelectItem>
                  <SelectItem value="18000">acima de R$ 12.000</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Retrabalho - Slider */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold mb-4 text-bvbp-corporate group-hover:text-bvbp-growth transition-colors">
                <Clock className="h-4 w-4" />
                Tempo médio de retrabalho (por pessoa/semana)
              </label>
              {renderSliderWithMarks(
                formData.reworkHours || 3,
                (val) => updateFormData({ reworkHours: val }),
                sliderConfigs.reworkHours,
                "Horas de retrabalho",
                "horas"
              )}
            </div>

            {/* Reuniões - Slider */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold mb-4 text-bvbp-corporate group-hover:text-bvbp-growth transition-colors">
                <MessageSquare className="h-4 w-4" />
                Tempo em reuniões improdutivas (por pessoa/semana)
              </label>
              {renderSliderWithMarks(
                formData.meetingHours || 2,
                (val) => updateFormData({ meetingHours: val }),
                sliderConfigs.meetingHours,
                "Horas em reuniões",
                "horas"
              )}
            </div>
          </div>
        )}

        {/* Step 2 - Results */}
        {currentStep === 2 && results && (
          <div className="space-y-6 sm:space-y-8 animate-fade-in">
            {/* Main Result Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Perda Mensal */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-red-50 to-white p-5 sm:p-6 rounded-xl border border-red-100 hover:shadow-strong transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-16 sm:w-20 h-16 sm:h-20 bg-red-100/50 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-red-600 mb-2 font-semibold">
                    <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Perda Mensal Estimada
                  </div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-600 group-hover:scale-105 transition-transform origin-left">
                    R$ {results.monthlyLoss.toLocaleString()}
                  </div>
                </div>
              </div>
              
              {/* Perda Anual */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-red-50 to-white p-5 sm:p-6 rounded-xl border border-red-100 hover:shadow-strong transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-16 sm:w-20 h-16 sm:h-20 bg-red-100/50 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-red-600 mb-2 font-semibold">
                    <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Perda Anual Estimada
                  </div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-600 group-hover:scale-105 transition-transform origin-left">
                    R$ {results.annualLoss.toLocaleString()}
                  </div>
                </div>
              </div>
              
              {/* Economia Inicial */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-50 to-white p-5 sm:p-6 rounded-xl border border-emerald-100 hover:shadow-strong transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-16 sm:w-20 h-16 sm:h-20 bg-emerald-100/50 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-600 mb-2 font-semibold">
                    <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Economia Inicial (90 dias)
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-600 group-hover:scale-105 transition-transform origin-left">
                    R$ {results.initialSavingsMin.toLocaleString()} – {results.initialSavingsMax.toLocaleString()}
                  </div>
                </div>
              </div>
              
              {/* Economia Sustentável */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-50 to-white p-5 sm:p-6 rounded-xl border border-emerald-100 hover:shadow-strong transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-16 sm:w-20 h-16 sm:h-20 bg-emerald-100/50 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-600 mb-2 font-semibold">
                    <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Economia Sustentável (mensal)
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-600 group-hover:scale-105 transition-transform origin-left">
                    R$ {results.sustainableSavingsMin.toLocaleString()} – {results.sustainableSavingsMax.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Insight Box */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-bvbp-corporate to-bvbp-growth rounded-xl shadow-strong">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <p className="text-white text-sm sm:text-base font-medium leading-relaxed">
                  Estes números representam apenas o custo de retrabalho e reuniões improdutivas. 
                  Outros custos ocultos como desalinhamento estratégico e perda de oportunidades 
                  podem elevar significativamente estas perdas.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mt-8 pt-6 border-t border-gray-100">
          {currentStep > 1 ? (
            <Button 
              variant="outline" 
              onClick={prevStep}
              className="h-11 sm:h-12 px-6 order-2 sm:order-1"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          ) : (
            <div className="hidden sm:block" />
          )}
          
          {currentStep === 1 && (
            <Button 
              variant="hero" 
              onClick={nextStep}
              disabled={!isFormComplete}
              className="h-11 sm:h-12 px-8 shadow-strong order-1 sm:order-2"
            >
              Calcular Perdas
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CalculatorForm;
