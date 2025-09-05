import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { LinkedinIcon, MailIcon, Users, Target, Heart, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import cristianoPhoto from "/lovable-uploads/4ca7c5b3-73ec-4d81-9501-ab6f211b3cae.png";
const AboutPage = () => {
  const team = [{
    name: "Cristiano Basso",
    role: "",
    bio: "10+ anos otimizando processos em empresas de diversos tamanhos. Especialista em transformar caos operacional em crescimento sustentável.",
    linkedin: "https://www.linkedin.com/in/cristianobasso/",
    photo: cristianoPhoto
  }, {
    name: "Conrado Vidal",
    role: "",
    bio: "9+ anos ajudando empresas a alinhar estratégia e execução. Especialista em transformar o complexo em simples, promovendo transparência e colaboração.",
    linkedin: "https://www.linkedin.com/in/conradovidal/",
    placeholder: true
  }];
  const values = [{
    icon: Target,
    title: "Orientação a Resultado",
    description: "Não vendemos PowerPoint. Entregamos melhorias mensuráveis e duradouras que impactam diretamente o resultado da empresa."
  }, {
    icon: Heart,
    title: "Honestidade",
    description: "Se não conseguirmos ajudar, falamos na lata. Só trabalhamos com empresas onde vemos potencial real de melhoria."
  }, {
    icon: Target,
    title: "Qualidade",
    description: "Garantimos soluções práticas e sustentáveis, entregues com atenção aos detalhes e compromisso com resultados."
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
                Guiamos empresas a crescer com propósito e estrutura, desenhando e implementando sistemas e processos que funcionam na prática, lado a lado com a equipe, para gerar resultados visíveis.
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
                    {member.photo ? (
                      <img 
                        src={member.photo} 
                        alt={`Foto de ${member.name}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Users className="h-16 w-16 text-muted-foreground/50" />
                      </div>
                    )}
                  </AspectRatio>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-heading text-xl font-bold text-bvbp-corporate">
                          {member.name}
                        </h3>
                        {member.role && (
                          <p className="text-bvbp-growth font-medium">
                            {member.role}
                          </p>
                        )}
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
                    A BVBP surgiu a partir da nossa experiência em transformar operações complexas em sistemas funcionais, focados em resultados reais. Ao longo dos anos, trabalhamos com diversas empresas e entendemos que otimizar processos não é apenas sobre eficiência, mas sobre garantir que cada decisão estratégica seja clara e mensurável.
                  </p>
                  <p className="text-foreground leading-relaxed mb-6">
                    Acreditamos que é essencial criar sistemas que não só otimizem, mas que tragam clareza e permitam a evolução contínua das equipes e resultados. Queremos ir além do diagnóstico: buscamos impactar positivamente a forma como as empresas operam no dia a dia, fornecendo a estrutura necessária para tomar decisões estratégicas com confiança e priorizar o que realmente importa.
                  </p>
                  <p className="text-bvbp-corporate font-semibold">
                    Nosso objetivo é continuar explorando novos desafios, ajudando organizações a alcançar o crescimento com propósito, clareza e, principalmente, com a capacidade de se adaptar e evoluir com consistência.
                  </p>
                </div>
                
                <div className="text-center mt-8 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="hero" size="xl" className="group" onClick={() => window.location.href = '/servicos'}>
                      Conheça nossos serviços
                      <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button 
                      variant="outline-hero" 
                      size="xl" 
                      onClick={() => window.location.href = '/calculadora-roi'}
                      className="hover:scale-105 transition-transform"
                    >
                      Descubra quanto sua empresa pode economizar
                    </Button>
                  </div>
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