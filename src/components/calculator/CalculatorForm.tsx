import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Target, Users, DollarSign, Clock, MessageSquare, Sparkles, TrendingUp, AlertTriangle } from "lucide-react";

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

// Faixas com valores médios para cálculo
const teamSizeRanges = [
  { label: "1-3 pessoas", value: "2", description: "Equipe pequena" },
  { label: "4-7 pessoas", value: "5", description: "Equipe enxuta" },
  { label: "8-15 pessoas", value: "11", description: "Equipe média" },
  { label: "16-30 pessoas", value: "23", description: "Equipe grande" },
  { label: "31-50 pessoas", value: "40", description: "Equipe muito grande" },
  { label: "50+ pessoas", value: "60", description: "Operação robusta" },
];

const reworkHoursRanges = [
  { label: "1-2 horas", value: "1.5", description: "Baixo retrabalho" },
  { label: "3-5 horas", value: "4", description: "Retrabalho moderado" },
  { label: "6-10 horas", value: "8", description: "Retrabalho alto" },
  { label: "10-15 horas", value: "12.5", description: "Retrabalho crítico" },
  { label: "15-20 horas", value: "17.5", description: "Situação grave" },
];

const meetingHoursRanges = [
  { label: "1-2 horas", value: "1.5", description: "Reuniões pontuais" },
  { label: "3-5 horas", value: "4", description: "Reuniões frequentes" },
  { label: "6-8 horas", value: "7", description: "Excesso de reuniões" },
  { label: "8-10 horas", value: "9", description: "Cultura de reunião" },
];

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
        onCalculationComplete();
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

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-8 md:p-10 shadow-strong border-0 bg-white">
        {/* Progress Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-success flex items-center justify-center shadow-success">
                {currentStep === 1 ? (
                  <Target className="h-5 w-5 text-white" />
                ) : (
                  <Sparkles className="h-5 w-5 text-white" />
                )}
              </div>
              <div>
                <h2 className="font-heading text-xl md:text-2xl font-bold text-bvbp-corporate">
                  {currentStep === 1 && "Dados da sua operação"}
                  {currentStep === 2 && "Seu resultado estimado"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {currentStep === 1 && "Preencha as informações abaixo"}
                  {currentStep === 2 && "Análise baseada nos dados informados"}
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-muted-foreground bg-muted px-4 py-2 rounded-full">
              <span className="text-bvbp-growth font-bold">{currentStep}</span>
              <span>/</span>
              <span>{totalSteps}</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-success h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step 1 - Form Fields */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-fade-in">
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

            {/* Tamanho da Equipe */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold mb-3 text-bvbp-corporate group-hover:text-bvbp-growth transition-colors">
                <Users className="h-4 w-4" />
                Tamanho da equipe envolvida
              </label>
              <Select 
                value={formData.teamSize?.toString() || ""} 
                onValueChange={(value) => updateFormData({ teamSize: parseFloat(value) })}
              >
                <SelectTrigger className="h-12 text-base bg-gray-50 border-gray-200 hover:border-bvbp-growth hover:bg-white transition-all focus:ring-2 focus:ring-bvbp-growth/20">
                  <SelectValue placeholder="Selecione o tamanho da equipe" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 z-50">
                  {teamSizeRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium">{range.label}</span>
                        <span className="text-muted-foreground text-sm ml-2">({range.description})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

            {/* Retrabalho */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold mb-3 text-bvbp-corporate group-hover:text-bvbp-growth transition-colors">
                <Clock className="h-4 w-4" />
                Tempo médio de retrabalho (por pessoa/semana)
              </label>
              <Select 
                value={formData.reworkHours?.toString() || ""} 
                onValueChange={(value) => updateFormData({ reworkHours: parseFloat(value) })}
              >
                <SelectTrigger className="h-12 text-base bg-gray-50 border-gray-200 hover:border-bvbp-growth hover:bg-white transition-all focus:ring-2 focus:ring-bvbp-growth/20">
                  <SelectValue placeholder="Selecione a faixa de horas" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 z-50">
                  {reworkHoursRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium">{range.label}</span>
                        <span className="text-muted-foreground text-sm ml-2">({range.description})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Reuniões */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold mb-3 text-bvbp-corporate group-hover:text-bvbp-growth transition-colors">
                <MessageSquare className="h-4 w-4" />
                Tempo em reuniões improdutivas (por pessoa/semana)
              </label>
              <Select 
                value={formData.meetingHours?.toString() || ""} 
                onValueChange={(value) => updateFormData({ meetingHours: parseFloat(value) })}
              >
                <SelectTrigger className="h-12 text-base bg-gray-50 border-gray-200 hover:border-bvbp-growth hover:bg-white transition-all focus:ring-2 focus:ring-bvbp-growth/20">
                  <SelectValue placeholder="Selecione a faixa de horas" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 z-50">
                  {meetingHoursRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium">{range.label}</span>
                        <span className="text-muted-foreground text-sm ml-2">({range.description})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Step 2 - Results */}
        {currentStep === 2 && results && (
          <div className="space-y-8 animate-fade-in">
            {/* Main Result Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Perda Mensal */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-red-50 to-white p-6 rounded-xl border border-red-100 hover:shadow-strong transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-20 h-20 bg-red-100/50 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                  <div className="flex items-center gap-2 text-sm text-red-600 mb-2 font-semibold">
                    <AlertTriangle className="h-4 w-4" />
                    Perda Mensal Estimada
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-red-600 group-hover:scale-105 transition-transform origin-left">
                    R$ {results.monthlyLoss.toLocaleString()}
                  </div>
                </div>
              </div>
              
              {/* Perda Anual */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-red-50 to-white p-6 rounded-xl border border-red-100 hover:shadow-strong transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-20 h-20 bg-red-100/50 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                  <div className="flex items-center gap-2 text-sm text-red-600 mb-2 font-semibold">
                    <AlertTriangle className="h-4 w-4" />
                    Perda Anual Estimada
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-red-600 group-hover:scale-105 transition-transform origin-left">
                    R$ {results.annualLoss.toLocaleString()}
                  </div>
                </div>
              </div>
              
              {/* Economia Inicial */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-50 to-white p-6 rounded-xl border border-emerald-100 hover:shadow-strong transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-100/50 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                  <div className="flex items-center gap-2 text-sm text-emerald-600 mb-2 font-semibold">
                    <TrendingUp className="h-4 w-4" />
                    Economia Inicial (90 dias)
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-emerald-600 group-hover:scale-105 transition-transform origin-left">
                    R$ {results.initialSavingsMin.toLocaleString()} – {results.initialSavingsMax.toLocaleString()}
                  </div>
                </div>
              </div>
              
              {/* Economia Sustentável */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-50 to-white p-6 rounded-xl border border-emerald-100 hover:shadow-strong transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-100/50 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                  <div className="flex items-center gap-2 text-sm text-emerald-600 mb-2 font-semibold">
                    <TrendingUp className="h-4 w-4" />
                    Economia Sustentável (mensal)
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-emerald-600 group-hover:scale-105 transition-transform origin-left">
                    R$ {results.sustainableSavingsMin.toLocaleString()} – {results.sustainableSavingsMax.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Insight Box */}
            <div className="p-6 bg-gradient-to-r from-bvbp-corporate to-bvbp-growth rounded-xl shadow-strong">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <p className="text-white font-medium leading-relaxed">
                  Só no processo de <strong>{results.processType}</strong>, sua empresa pode estar perdendo cerca de <strong>R$ {results.monthlyLoss.toLocaleString()}/mês</strong> em retrabalho e reuniões improdutivas. Com a BVBP, é realista recuperar parte desse valor em até 90 dias.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-8 mt-8 border-t border-gray-100">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 h-12 px-6"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </Button>

          {currentStep < totalSteps && (
            <Button 
              variant="hero"
              onClick={nextStep}
              disabled={!isFormComplete}
              className="flex items-center gap-2 h-12 px-8 shadow-strong disabled:opacity-50"
            >
              Ver Resultado
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CalculatorForm;