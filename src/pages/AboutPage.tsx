import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LinkedinIcon, MailIcon, Users, Target, Heart, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
const AboutPage = () => {
  const team = [{
    name: "João Basso",
    role: "Business Agility Specialist",
    bio: "10+ anos otimizando operações em empresas de tecnologia. Especialista em transformar caos operacional em crescimento sustentável.",
    expertise: ["Process Optimization", "Business Agility", "Operational Excellence", "Team Leadership"],
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  }, {
    name: "Vidal",
    role: "Operations & Process Expert",
    bio: "Expertise em desenhar processos que funcionam na vida real. Experiência prática em scaling de operações para empresas em rápido crescimento.",
    expertise: ["Process Design", "Operations Scaling", "Systems Integration", "Change Management"],
    image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  }];
  const values = [{
    icon: Target,
    title: "Resultados Reais",
    description: "Não vendemos PowerPoint. Entregamos melhorias mensuráveis e duradouras que impactam diretamente o resultado da empresa."
  }, {
    icon: Heart,
    title: "Honestidade Transparente",
    description: "Se não conseguirmos ajudar, falamos na lata. Só trabalhamos com empresas onde vemos potencial real de melhoria."
  }, {
    icon: Users,
    title: "Autonomia Garantida",
    description: "Nosso sucesso é sua independência. Em 90 dias você não precisa mais da gente - isso é uma promessa."
  }];
  return <div className="min-h-screen">
      <Helmet>
        <title>Sobre Nós - BVBP | Especialistas em Transformação de Processos</title>
        <meta name="description" content="Conheça a equipe BVBP: especialistas em transformação de processos com 10+ anos de experiência em otimização operacional para SMBs brasileiras." />
      </Helmet>
      
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-16 lg:py-24 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-bvbp-corporate mb-6">
                Quem Somos
              </h1>
              
              
            </div>
          </div>
        </section>

        {/* Team Section */}
        

        {/* Mission Section */}
        <section className="py-16 bg-bvbp-growth-light">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-6">
                Nossa Missão
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-foreground leading-relaxed mb-8">
                  Ajudar SMBs brasileiras a <strong>crescer sem perder o controle operacional</strong>. 
                  Acreditamos que toda empresa merece processos que funcionam na prática, 
                  não "receitas de bolo" que não encaixam na sua realidade.
                </p>
                <p className="text-lg text-muted-foreground">
                  Nossa abordagem é simples: entender sua situação específica, criar soluções sob medida, 
                  implementar com você e garantir que sua equipe fique autônoma para continuar evoluindo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-4">
                Nossos Valores
              </h2>
              
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {values.map((value, index) => {
              const IconComponent = value.icon;
              return <Card key={index} className="p-6 text-center hover:shadow-soft transition-smooth">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-hero mb-4">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-bvbp-corporate mb-3">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </Card>;
            })}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="p-8 md:p-12">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-6 text-center">Por que começamos a BVBP</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-foreground leading-relaxed mb-6">
                    Depois de anos vendo empresas repetirem os mesmos erros operacionais - 
                    consultorias caras que entregam PowerPoints genéricos, metodologias "prontas" 
                    que não funcionam na prática, dependência eterna de consultores - 
                    decidimos fazer diferente.
                  </p>
                  <p className="text-foreground leading-relaxed mb-6">
                    Vivenciamos na pele os desafios de escalar operações em empresas de alto crescimento. 
                    Sabemos o que funciona (e o que não funciona) quando você precisa passar de 30 para 
                    80 funcionários sem virar um caos.
                  </p>
                  <p className="text-bvbp-corporate font-semibold">
                    A BVBP nasceu para resolver esse problema de forma acessível, prática e com resultados reais.
                  </p>
                </div>
                
                <div className="text-center mt-8">
                  <Button variant="hero" size="xl" className="group">
                    Conheça Nossos Serviços
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>;
};
export default AboutPage;