import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Clock, TrendingDown, DollarSign, Frown, ArrowDown } from "lucide-react";

const ProblemSection = () => {
  const painPoints = [
    {
      icon: Flame,
      title: "CEO passando 70% do tempo apagando incêndios",
      description: "Sempre correndo atrás de problemas que poderiam ser evitados",
      color: "text-red-500"
    },
    {
      icon: Clock,
      title: "40% das reuniões sem objetivo claro",
      description: "Tempo perdido em discussões que não geram resultado",
      color: "text-orange-500"
    },
    {
      icon: TrendingDown,
      title: "Crescimento travado porque operação não aguenta",
      description: "Estrutura atual não suporta mais demanda",
      color: "text-red-600"
    },
    {
      icon: DollarSign,
      title: "Dinheiro jogado fora em retrabalho constante",
      description: "Mesmas tarefas sendo feitas múltiplas vezes",
      color: "text-red-500"
    },
    {
      icon: Frown,
      title: "Equipe sobrecarregada e desmotivada",
      description: "Alta rotatividade e baixa produtividade",
      color: "text-orange-600"
    }
  ];

  return (
    <section className="py-16 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-4">
            Reconhece Alguns Destes Problemas?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Se sua empresa cresceu mas a operação virou um caos, você não está sozinho
          </p>
        </div>

        {/* Pain Points Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {painPoints.map((pain, index) => {
            const IconComponent = pain.icon;
            return (
              <Card key={index} className="p-6 hover:shadow-soft transition-smooth border-l-4 border-l-red-500">
                <div className="flex items-start space-x-4">
                  <div className="p-2 rounded-lg bg-red-50">
                    <IconComponent className={`h-6 w-6 ${pain.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2 leading-tight">
                      {pain.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {pain.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Agitation Content */}
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 md:p-12 bg-red-50 border-red-200">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                <ArrowDown className="h-8 w-8 text-red-600" />
              </div>
              
              <h3 className="font-heading text-2xl md:text-3xl font-bold text-bvbp-corporate">
                O Custo Real da Ineficiência
              </h3>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-foreground leading-relaxed mb-6">
                  Se sua empresa cresceu de 30 para 80 funcionários mas a operação virou um caos, 
                  você não está sozinho. Segundo a <strong>McKinsey</strong>, empresas brasileiras 
                  perdem até <span className="text-red-600 font-bold">30% da receita</span> com 
                  ineficiências operacionais.
                </p>
                
                <div className="bg-white p-6 rounded-lg border-l-4 border-l-bvbp-corporate">
                  <p className="text-bvbp-corporate font-semibold mb-2">O problema:</p>
                  <p className="text-foreground">
                    Consultorias tradicionais oferecem <em>"receitas prontas"</em> que não encaixam 
                    na <strong>SUA realidade específica</strong>. Resultado? Dinheiro jogado fora 
                    em soluções que não funcionam na prática.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">R$ 50k+</div>
                  <div className="text-sm text-muted-foreground">Perdidos mensalmente</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">70%</div>
                  <div className="text-sm text-muted-foreground">Tempo CEO desperdiçado</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">40%</div>
                  <div className="text-sm text-muted-foreground">Reuniões improdutivas</div>
                </div>
              </div>

              <Button variant="hero" size="xl" className="mt-8">
                QUERO PARAR DE PERDER DINHEIRO AGORA
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;