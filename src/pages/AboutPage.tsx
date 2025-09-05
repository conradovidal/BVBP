import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { LinkedinIcon, MailIcon, Users, Target, Heart, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
const AboutPage = () => {
  const team = [{
    name: "Cristiano Basso",
    role: "",
    bio: "10+ anos otimizando processos em empresas de diversos tamanhos. Especialista em transformar caos operacional em crescimento sustentável.",
    linkedin: "https://www.linkedin.com/in/cristianobasso/",
    photo: "/lovable-uploads/5308fe52-0ff8-4f9d-8040-99ff6ff89d35.png"
  }, {
    name: "Conrado Vidal",
    role: "",
    bio: "9+ anos ajudando empresas a alinhar estratégia e execução. Especialista em transformar o complexo em simples, promovendo transparência e colaboração.",
    linkedin: "https://www.linkedin.com/in/conradovidal/",
    photo: "/lovable-uploads/c237e246-d750-44a5-96a1-510e298e84ed.png"
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
        <section className="relative py-20 lg:py-28 bg-gradient-hero overflow-hidden">
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 animate-fade-in">
                Sobre a BVBP
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in [animation-delay:200ms]">
                Transformamos complexidade em clareza.<br/>
                <span className="text-bvbp-growth-light font-semibold">Parceiros estratégicos para empresas em crescimento.</span>
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="relative py-20 bg-white overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-success"></div>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-bvbp-growth mb-8 shadow-success">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h2 className="font-heading text-3xl md:text-5xl font-bold text-bvbp-corporate mb-8">
                Nossa Missão
              </h2>
              <p className="text-xl md:text-2xl text-foreground leading-relaxed font-medium">
                Transformamos o <span className="text-bvbp-growth font-bold">caos operacional</span> em <span className="text-bvbp-growth font-bold">crescimento estruturado</span>. Trabalhamos lado a lado com empresas para implementar sistemas e processos que realmente funcionam, eliminando ineficiências e criando bases sólidas para o sucesso sustentável.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl md:text-5xl font-bold text-bvbp-corporate mb-6">
                Nosso Time
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Conheça os especialistas que transformam visão em realidade
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {team.map((member, index) => (
                <Card key={index} className="group overflow-hidden hover:shadow-strong transition-all duration-500 hover:-translate-y-2 bg-white border-0">
                  <div className="relative">
                    <AspectRatio ratio={4 / 5}>
                      {member.photo ? (
                        <img 
                          src={member.photo} 
                          alt={`Foto de ${member.name}`}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Users className="h-16 w-16 text-muted-foreground/50" />
                        </div>
                      )}
                    </AspectRatio>
                    <div className="absolute top-4 right-4">
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`LinkedIn de ${member.name}`}
                        className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm hover:bg-bvbp-growth hover:text-white transition-all duration-300 shadow-soft"
                      >
                        <LinkedinIcon className="h-6 w-6" />
                      </a>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="font-heading text-2xl font-bold text-bvbp-corporate mb-2">
                      {member.name}
                    </h3>
                    {member.role && (
                      <p className="text-bvbp-growth font-semibold mb-4 text-lg">
                        {member.role}
                      </p>
                    )}
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {member.bio}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-white relative">
          <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-success"></div>
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl md:text-5xl font-bold text-bvbp-corporate mb-6">
                Nossos Valores
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Os princípios que guiam cada decisão e ação
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {values.map((value, index) => {
              const IconComponent = value.icon;
              return <Card key={index} className="group p-8 text-center hover:shadow-strong transition-all duration-500 hover:-translate-y-2 border-0 bg-gradient-subtle relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-success opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-hero mb-6 group-hover:scale-110 transition-transform duration-300 shadow-soft">
                        <IconComponent className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="font-heading text-2xl font-bold text-bvbp-corporate mb-4 group-hover:text-bvbp-growth transition-colors duration-300">
                        {value.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-lg">
                        {value.description}
                      </p>
                    </div>
                  </Card>;
            })}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 bg-gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto">
              <Card className="p-10 md:p-16 bg-white/95 backdrop-blur-sm border-0 shadow-strong">
                <h2 className="font-heading text-3xl md:text-5xl font-bold text-bvbp-corporate mb-8 text-center">Por que começamos a BVBP</h2>
                <div className="prose prose-xl max-w-none">
                  <p className="text-foreground leading-relaxed mb-8 text-lg">
                    A BVBP surgiu a partir da nossa experiência em transformar operações complexas em sistemas funcionais, focados em resultados reais. Ao longo dos anos, trabalhamos com diversas empresas e entendemos que otimizar processos não é apenas sobre eficiência, mas sobre garantir que cada decisão estratégica seja clara e mensurável.
                  </p>
                  <p className="text-foreground leading-relaxed mb-8 text-lg">
                    Acreditamos que é essencial criar sistemas que não só otimizem, mas que tragam clareza e permitam a evolução contínua das equipes e resultados. Queremos ir além do diagnóstico: buscamos impactar positivamente a forma como as empresas operam no dia a dia, fornecendo a estrutura necessária para tomar decisões estratégicas com confiança e priorizar o que realmente importa.
                  </p>
                  <div className="p-6 bg-bvbp-growth rounded-xl mb-8">
                    <p className="text-white font-semibold text-xl leading-relaxed">
                      Nosso objetivo é continuar explorando novos desafios, ajudando organizações a alcançar o crescimento com propósito, clareza e, principalmente, com a capacidade de se adaptar e evoluir com consistência.
                    </p>
                  </div>
                </div>
                
                <div className="text-center mt-12 space-y-6">
                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <Button variant="hero" size="xl" className="group shadow-strong" onClick={() => window.location.href = '/servicos'}>
                      Conheça nossos serviços
                      <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button 
                      variant="outline-hero" 
                      size="xl" 
                      onClick={() => window.location.href = '/calculadora-roi'}
                      className="hover:scale-105 transition-transform shadow-soft"
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