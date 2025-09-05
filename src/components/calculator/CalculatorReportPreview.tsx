import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BarChart3, Target, Rocket } from "lucide-react";

const CalculatorReportPreview = () => {
  const reportSections = [
    {
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      title: "DIAGNÓSTICO COMPLETO",
      items: [
        "Mapeamento das suas perdas atuais",
        "Benchmark vs. empresas similares", 
        "Identificação dos 3 maiores gargalos"
      ]
    },
    {
      icon: <FileText className="h-8 w-8 text-success" />,
      title: "CÁLCULO FINANCEIRO",
      items: [
        "Perda mensal detalhada por categoria",
        "Projeção anual de desperdícios",
        "Potencial de economia realística"
      ]
    },
    {
      icon: <Target className="h-8 w-8 text-bvbp-corporate" />,
      title: "PLANO DE AÇÃO",
      items: [
        "5 quick wins implementáveis",
        "Priorização por impacto vs. esforço",
        "Timeline de implementação"
      ]
    },
    {
      icon: <Rocket className="h-8 w-8 text-accent" />,
      title: "OPORTUNIDADE BVBP",
      items: [
        "Como podemos ajudar especificamente",
        "Investimento vs. retorno esperado",
        "Próximos passos sugeridos"
      ]
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Veja o Que Você Vai Receber
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Relatório personalizado completo com análise detalhada das suas oportunidades de otimização
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {reportSections.map((section, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-3">
                  {section.icon}
                </div>
                <CardTitle className="text-lg font-semibold text-foreground">
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 p-8 bg-background/80 backdrop-blur rounded-lg max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-3 mb-4">
            <FileText className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">Formato PDF Profissional</span>
          </div>
          <p className="text-muted-foreground">
            Relatório executivo de 4 páginas, personalizado com o nome da sua empresa, 
            pronto para apresentar à diretoria ou investidores.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CalculatorReportPreview;