import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { LinkedinIcon, MailIcon, Users, Target, Heart, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import ConradoImg from "@/assets/conrado-vidal.jpg";
import CristianoImg from "@/assets/cristiano-basso.jpg";
const AboutPage = () => {
  const team = [{
    name: "Cristiano Basso",
    role: "Head of Business Operations",
    bio: "10+ anos otimizando operações em empresas de tecnologia. Especialista em transformar caos operacional em crescimento sustentável.",
    image: CristianoImg,
    linkedin: "https://www.linkedin.com/in/cristianobasso/",
    grayscale: true
  }, {
    name: "Conrado Vidal",
    role: "Business Agility Specialist",
    bio: "Expertise em desenhar processos que funcionam na vida real. Experiência prática em scaling de operações para empresas em rápido crescimento.",
    image: ConradoImg,
    linkedin: "https://www.linkedin.com/in/conradovidal/",
    grayscale: false
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
        <title>Sobre a BVBP - Basso & Vidal Business Partners | Parceiros de Execução</title>
        <meta name="description" content="Basso & Vidal Business Partners — parceiros de execução para empresas em crescimento. Menos caos, mais resultado. Conheça nossa missão e equipe." />
      </Helmet>
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-16 lg:py-24 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-bvbp-corporate mb-6">
                Sobre a BVBP
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Basso & Vidal Business Partners<br/>
                Transformamos complexidade em clareza.<br/>
                Parceiros estratégicos para empresas em crescimento.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-bvbp-growth-light">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-6">
                Missão
              </h2>
              <p className="text-xl text-foreground leading-relaxed">
                Ajudar empresas a crescer sem perder o controle operacional. 
                Fazemos isso desenhando sistemas e processos que funcionam na prática, 
                implementados lado a lado com a equipe, para entregar resultados visíveis 
                em até 90 dias e autonomia depois.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-bvbp-corporate mb-4">
                Nosso Time
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {team.map((member, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-soft transition-smooth">
                  <AspectRatio ratio={16 / 9}>
                    <img
                      src={member.image}
                      alt={`Foto de ${member.name}, ${member.role} da BVBP`}
                      className={`w-full h-full object-cover ${member.grayscale ? 'grayscale brightness-95 contrast-105' : ''}`}
                    />
                  </AspectRatio>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-heading text-xl font-bold text-bvbp-corporate">
                          {member.name}
                        </h3>
                        <p className="text-bvbp-growth font-medium">
                          {member.role}
                        </p>
                      </div>
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`LinkedIn de ${member.name}`}
                        className="text-bvbp-corporate hover:text-bvbp-growth transition-smooth"
                      >
                        <LinkedinIcon className="h-6 w-6" />
                      </a>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </Card>
              ))}
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
                  <Button variant="hero" size="xl" className="group" onClick={() => window.location.href = '/servicos'}>
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