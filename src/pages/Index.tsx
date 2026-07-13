import { FormEvent, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Bot,
  CheckCircle,
  Clock,
  DollarSign,
  Filter,
  LinkedinIcon,
  MailIcon,
  Route,
  Search,
  Target,
  Workflow,
  Zap,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { submitLead } from "@/lib/submitLead";
import portalPreviewImage from "@/assets/portal-preview.png";

const pillars = [
  {
    title: "Finanças",
    short: "Receita, margem, custo, caixa, risco e potencial sem ruído.",
    icon: DollarSign,
  },
  {
    title: "Comercial",
    short: "Origem, conversão, pipeline, follow-up e proposta com ritmo.",
    icon: Filter,
  },
  {
    title: "Operação",
    short: "Fluxo, espera, retrabalho, capacidade e entrega sob controle.",
    icon: Workflow,
  },
  {
    title: "Tecnologia",
    short: "Dados, IA e sistemas apenas quando movem ponteiro real.",
    icon: Bot,
  },
];

const problems = [
  {
    title: "Decisão sem ponteiro",
    description: "A reunião termina com tarefas, mas sem clareza sobre qual número precisa mudar.",
  },
  {
    title: "Comercial disperso",
    description: "Oportunidades dependem de memória, esforço manual e follow-up disperso.",
  },
  {
    title: "Crescimento com atrito",
    description: "Mais demanda vira fila, retrabalho, espera e perda de margem.",
  },
  {
    title: "Automação sem ponteiro",
    description: "Ferramentas entram antes da pergunta certa: qual ponteiro isso move?",
  },
];

const offers = [
  {
    title: "BVBP Performance Sprint",
    duration: "90 dias",
    mode: "Entrada intensiva",
    description: "Implementação assistida para empresas com dor clara, urgência e necessidade de destravar performance rapidamente.",
    features: [
      "Ponteiros prioritários",
      "Mapa comercial e operacional",
      "Backlog de alavancas",
      "Ciclos PDCA semanais",
      "Devolutiva executiva",
    ],
    cta: "Quero discutir um Sprint",
  },
  {
    title: "BVBP Performance Partnership",
    duration: "12 meses",
    mode: "Parceria contínua",
    description: "Implementação contínua, lado a lado com o cliente, para sustentar rotina de performance.",
    features: [
      "Rotina mensal de performance",
      "Acompanhamento de ponteiros",
      "Ciclos contínuos de melhoria",
      "Evolução da plataforma",
      "Governança de evidências",
    ],
    cta: "Quero discutir parceria",
  },
];

const methodSteps = [
  { title: "Entender o jogo", description: "Modelo, margem, dor e travas de crescimento.", icon: Search },
  { title: "Escolher ponteiros", description: "Poucos indicadores conectados à decisão do dono.", icon: Target },
  { title: "Mapear fluxos críticos", description: "Como a receita nasce e como a entrega acontece.", icon: Route },
  { title: "Priorizar alavancas", description: "O que move número com mais impacto e confiança.", icon: Zap },
  { title: "Executar ciclos PDCA", description: "Planejar, executar, medir, aprender e ajustar.", icon: Clock },
  { title: "Automatizar o que vale", description: "Automação só entra quando move ponteiro real.", icon: Bot },
  { title: "Sustentar a gestão", description: "Rotina, evidência e autonomia para continuar evoluindo.", icon: CheckCircle },
];

const platformSignals = [
  "Ponteiros",
  "Comercial",
  "Gargalos",
  "PDCA",
  "Tecnologia",
  "Evidências",
];

const automationExamples = [
  "Organizar documentos, bases e evidências para reduzir busca manual.",
  "Dar visibilidade a finanças, comercial e operação.",
  "Apoiar follow-up comercial quando a cadência estiver clara.",
  "Gerar relatórios executivos a partir de dados confiáveis.",
  "Criar formulários, aplicações internas e fluxos de aprovação quando houver ponteiro claro.",
  "Usar IA para triagem, classificação ou análise quando houver decisão conectada.",
];

const team = [
  {
    name: "Cristiano Basso",
    bio: "Estrutura operação, governança e execução para transformar intenção em rotina.",
    linkedin: "https://www.linkedin.com/in/cristianobasso/",
    photo: "/uploads/5308fe52-0ff8-4f9d-8040-99ff6ff89d35.png",
  },
  {
    name: "Conrado Vidal",
    bio: "Conecta estratégia, dados, produto e tecnologia para mover ponteiros reais.",
    linkedin: "https://www.linkedin.com/in/conradovidal/",
    photo: "/uploads/conrado-vidal.jpeg",
  },
];

const values = [
  {
    title: "Número antes da ferramenta",
    description: "Tecnologia entra quando existe clareza sobre o ponteiro que precisa melhorar.",
  },
  {
    title: "Ciclo antes da apresentação",
    description: "A rotina precisa testar hipóteses, medir efeito e registrar aprendizado.",
  },
  {
    title: "Evidência para decidir",
    description: "Toda melhoria precisa deixar rastro: hipótese, ação, resultado observado e próxima decisão.",
  },
];

const emails = [
  { email: "conrado@bvbp.com.br", link: "mailto:conrado@bvbp.com.br?subject=Contato%20BVBP" },
  { email: "cristiano@bvbp.com.br", link: "mailto:cristiano@bvbp.com.br?subject=Contato%20BVBP" },
];

const Index = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    interest: "",
    challenge: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    window.setTimeout(() => {
      document.getElementById(hash.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const result = await submitLead({ formData, source: "homepage" });

    if (result.success) {
      toast({
        title: "Recebemos seus dados.",
        description: "Responderemos em até 4 horas úteis.",
      });
      setFormData({ name: "", email: "", phone: "", company: "", role: "", interest: "", challenge: "" });
    } else {
      toast({
        title: "Dados inválidos",
        description: result.errors?.join(", ") || "Verifique os campos e tente novamente.",
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
  };

  const scrollToContact = () => {
    document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Helmet>
        <title>BVBP | Performance operacional com controle</title>
        <meta
          name="description"
          content="Método BVBP de performance operacional para conectar finanças, comercial, operação, tecnologia, ciclos PDCA, evidências e próxima decisão."
        />
        <meta name="robots" content="max-snippet:-1, max-image-preview:large" />
        <link rel="canonical" href="https://bvbp.com.br/" />
      </Helmet>

      <div className="min-h-screen bg-bvbp-ivory text-bvbp-ink">
        <Header />
        <main>
          <article className="sr-only" aria-hidden="false">
            <h2>O que é a BVBP?</h2>
            <p>
              A BVBP conecta finanças, comercial, operação e tecnologia para transformar crescimento em
              rotina de gestão. O método combina ponteiros, fluxos, alavancas, ciclos PDCA, automação conectada a
              indicador e evidências para a próxima decisão.
            </p>
            <h2>Quais ofertas a BVBP oferece?</h2>
            <p>
              As ofertas principais são o BVBP Performance Sprint, de 90 dias, e o BVBP Performance Partnership,
              de 12 meses. Ambas partem de potencial mapeado, baseline e execução assistida.
            </p>
          </article>

          <section
            id="inicio"
            className="relative overflow-hidden bg-bvbp-ivory py-16 lg:py-24"
          >
            <div className="container relative z-10 mx-auto grid items-center gap-12 px-4 lg:grid-cols-[1.02fr_0.98fr]">
              <div className="space-y-9">
                <h1 className="max-w-4xl font-heading text-5xl font-medium leading-[1.02] text-bvbp-ink md:text-6xl lg:text-7xl">
                  Crescer com clareza sobre qual ponteiro mover e qual decisão tomar.
                </h1>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    className="h-12 rounded-md bg-bvbp-forest px-6 text-sm font-semibold text-bvbp-ivory shadow-none hover:bg-bvbp-forest-dark"
                    onClick={scrollToContact}
                  >
                    Falar com a BVBP
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 rounded-md border-bvbp-forest/45 bg-transparent px-6 text-sm font-semibold text-bvbp-forest hover:bg-bvbp-inset"
                    onClick={() => document.getElementById("metodo")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    Conhecer o método
                  </Button>
                </div>
              </div>

              <div className="relative">
                <article className="overflow-hidden rounded-[10px] border border-bvbp-ink/10 bg-bvbp-raised shadow-[0_18px_50px_rgba(26,25,23,0.08)]">
                  <div className="h-0.5 bg-bvbp-gold" aria-hidden="true" />
                  <div className="p-5 sm:p-6">
                    <div className="mb-8 flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-heading text-3xl font-medium leading-none text-bvbp-ink">
                          Método BVBP
                        </h2>
                      </div>
                      <div className="rounded-md bg-bvbp-forest px-3 py-2 text-right text-bvbp-ivory">
                        <p className="font-label text-[10px] uppercase text-bvbp-ivory/60">Pilares</p>
                        <p className="font-heading text-3xl leading-none">4</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {pillars.map((pillar, index) => {
                        const Icon = pillar.icon;
                        return (
                          <div
                            key={pillar.title}
                            className="group flex min-h-[130px] flex-col justify-between rounded-md border border-bvbp-ink/10 bg-bvbp-ivory p-4 text-left text-bvbp-ink transition-colors duration-200 hover:border-bvbp-gold hover:bg-bvbp-inset"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className="font-label text-[11px] font-medium text-bvbp-muted-ink">
                                {String(index + 1).padStart(2, "0")}
                              </span>
                              <Icon className="h-4 w-4 shrink-0 text-bvbp-forest transition-colors group-hover:text-bvbp-gold" aria-hidden="true" />
                            </div>
                            <h3 className="font-heading text-xl font-medium leading-tight">{pillar.title}</h3>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-3 border-t border-bvbp-ink/10 pt-5 text-sm">
                      <div>
                        <p className="font-heading text-xl leading-none text-bvbp-forest sm:text-2xl">7 etapas</p>
                        <p className="mt-1 font-label text-[10px] uppercase text-bvbp-muted-ink">do modelo de negócio à gestão</p>
                      </div>
                      <div>
                        <p className="font-heading text-xl leading-none text-bvbp-forest sm:text-2xl">Ponteiros</p>
                        <p className="mt-1 font-label text-[10px] uppercase text-bvbp-muted-ink">clareza sobre o que mover</p>
                      </div>
                      <div>
                        <p className="font-heading text-xl leading-none text-bvbp-forest sm:text-2xl">Evidências</p>
                        <p className="mt-1 font-label text-[10px] uppercase text-bvbp-muted-ink">base para tomada de decisão</p>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </section>

          <section
            id="metodo"
            className="bg-bvbp-raised py-16 lg:py-20"
          >
            <div className="container mx-auto px-4">
              <div className="mx-auto mb-12 max-w-4xl">
                <p className="mb-4 font-label text-xs font-medium uppercase text-bvbp-muted-ink">
                  Método BVBP
                </p>
                <h2 className="max-w-3xl font-heading text-4xl font-medium leading-tight text-bvbp-ink md:text-5xl">
                  Do número certo à rotina que sustenta melhoria.
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-bvbp-muted-ink">
                  Começamos pelo ponteiro do negócio, mapeamos onde ele nasce e executamos ciclos curtos até haver
                  evidência para decidir.
                </p>
              </div>

              <div className="relative grid gap-5 md:grid-cols-2 xl:grid-cols-7">
                <div className="absolute left-0 right-0 top-8 hidden h-px bg-bvbp-ink/10 xl:block" aria-hidden="true" />
                {methodSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.title}
                      className="group relative rounded-md border border-bvbp-ink/10 bg-bvbp-raised p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-bvbp-gold hover:bg-bvbp-ivory"
                    >
                      <div className="mb-5 flex items-center justify-between gap-3">
                        <span className="font-label text-xs font-medium text-bvbp-gold">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <Icon className="h-5 w-5 text-bvbp-forest transition-colors group-hover:text-bvbp-gold" aria-hidden="true" />
                      </div>
                      <h3 className="font-heading text-xl font-medium leading-tight text-bvbp-ink">{step.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-bvbp-muted-ink">{step.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="bg-bvbp-ivory py-16 lg:py-20">
            <div className="container mx-auto px-4">
              <div className="mx-auto mb-12 max-w-4xl">
                <p className="mb-4 font-label text-xs font-medium uppercase text-bvbp-muted-ink">Sinais de perda</p>
                <h2 className="max-w-3xl font-heading text-4xl font-medium leading-tight text-bvbp-ink md:text-5xl">
                  Onde a performance costuma escapar
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-bvbp-muted-ink">
                  O problema raramente é esforço. Normalmente falta conexão entre finanças, comercial, operação,
                  tecnologia e próxima decisão.
                </p>
              </div>

              <div className="mx-auto grid max-w-6xl border-t border-bvbp-ink/10 md:grid-cols-2 lg:grid-cols-4">
                {problems.map((problem, index) => (
                  <div
                    key={problem.title}
                    className="group border-b border-bvbp-ink/10 py-6 transition-colors hover:bg-bvbp-raised md:px-5 lg:border-b-0 lg:border-r lg:border-bvbp-ink/10 lg:last:border-r-0"
                  >
                    <p className="font-label text-xs font-medium text-bvbp-gold">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-7 font-heading text-2xl font-medium leading-tight text-bvbp-ink">
                      {problem.title}
                    </h3>
                    <p className="mt-4 text-sm leading-6 text-bvbp-muted-ink">{problem.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section
            id="plataforma"
            className="bg-bvbp-raised py-16 lg:py-20"
          >
            <div className="container mx-auto grid items-center gap-12 px-4 lg:grid-cols-[0.82fr_1.18fr]">
              <div>
                <p className="mb-4 font-label text-xs font-medium uppercase text-bvbp-muted-ink">Plataforma BVBP</p>
                <h2 className="font-heading text-4xl font-medium leading-tight text-bvbp-ink md:text-5xl">
                  A visão de cliente para acompanhar decisão, execução e evidência.
                </h2>
                <p className="mt-5 text-lg leading-8 text-bvbp-muted-ink">
                  O preview mostra uma empresa fictícia em crescimento, com números saudáveis e gargalos reais de
                  escala. A aplicação organiza ponteiros de finanças, comercial, operação, tecnologia, ciclos PDCA e próximas decisões.
                </p>
                <div className="mt-8 grid border-t border-bvbp-ink/10 sm:grid-cols-2">
                  {platformSignals.map((signal, index) => (
                    <div key={signal} className="flex items-center gap-3 border-b border-bvbp-ink/10 py-3 text-sm font-medium text-bvbp-ink">
                      <span className="font-label text-[11px] text-bvbp-gold">{String(index + 1).padStart(2, "0")}</span>
                      <span>{signal}</span>
                    </div>
                  ))}
                </div>
                <Button
                  className="mt-8 h-12 rounded-md bg-bvbp-forest px-6 text-sm font-semibold text-bvbp-ivory shadow-none hover:bg-bvbp-forest-dark"
                  onClick={() => {
                    window.location.href = "/app";
                  }}
                >
                  Acessar preview do portal
                </Button>
              </div>

              <figure className="overflow-hidden rounded-md border border-bvbp-ink/10 bg-bvbp-ivory p-3 shadow-[0_18px_50px_rgba(26,25,23,0.08)]">
                <img
                  src={portalPreviewImage}
                  alt="Preview real da visão de cliente do portal BVBP"
                  className="h-auto w-full rounded-sm border border-bvbp-ink/10"
                />
                <figcaption className="mt-3 font-label text-[11px] uppercase text-bvbp-muted-ink">
                  Visão de cliente - Prisma Distribuição B2B
                </figcaption>
              </figure>
            </div>
          </section>

          <section
            id="ofertas"
            className="bg-bvbp-ivory py-16 lg:py-20"
          >
            <div className="container mx-auto px-4">
              <div className="mx-auto mb-12 max-w-4xl">
                <p className="mb-4 font-label text-xs font-medium uppercase text-bvbp-muted-ink">Ofertas</p>
                <h2 className="font-heading text-4xl font-medium leading-tight text-bvbp-ink md:text-5xl">
                  Duas formas de implementar o método.
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-bvbp-muted-ink">
                  Duas entradas para momentos diferentes. Sem promessa artificial: potencial mapeado, baseline,
                  rotina de execução e evidência guiam a conversa.
                </p>
              </div>

              <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
                {offers.map((offer) => (
                  <article key={offer.title} className="group flex h-full flex-col rounded-md border border-bvbp-ink/10 bg-bvbp-raised p-6 transition-colors hover:border-bvbp-gold lg:p-8">
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-heading text-3xl font-medium leading-tight text-bvbp-ink">{offer.title}</h3>
                        <p className="mt-3 text-sm leading-6 text-bvbp-muted-ink">{offer.description}</p>
                      </div>
                      <div className="shrink-0 rounded-md border border-bvbp-ink/10 bg-bvbp-ivory p-4 text-left sm:text-right">
                        <p className="font-label text-xs font-medium uppercase text-bvbp-gold">{offer.duration}</p>
                        <p className="mt-2 font-heading text-xl font-medium text-bvbp-ink">{offer.mode}</p>
                      </div>
                    </div>

                    <div className="grid flex-1 border-t border-bvbp-ink/10 sm:grid-cols-2">
                      {offer.features.map((feature) => (
                        <div key={feature} className="border-b border-bvbp-ink/10 py-3 text-sm leading-6 text-bvbp-ink sm:pr-4">
                          {feature}
                        </div>
                      ))}
                    </div>

                    <Button
                      className="mt-8 h-12 w-full rounded-md bg-bvbp-forest px-6 text-sm font-semibold text-bvbp-ivory shadow-none hover:bg-bvbp-forest-dark"
                      onClick={scrollToContact}
                    >
                      {offer.cta}
                    </Button>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-bvbp-forest py-16 text-bvbp-ivory lg:py-20">
            <div className="container mx-auto px-4">
              <div className="mx-auto mb-12 max-w-4xl">
                <p className="mb-4 font-label text-xs font-medium uppercase text-bvbp-ivory/60">Automação com tese</p>
                <h2 className="font-heading text-4xl font-medium leading-tight md:text-5xl">
                  IA e automação sem hype.
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-bvbp-ivory/72">
                  Usamos tecnologia para reduzir trabalho manual, organizar informação e aumentar visibilidade. Só
                  automatizamos o que tem conexão clara com um ponteiro do negócio.
                </p>
              </div>

              <div className="mx-auto grid max-w-6xl border-t border-bvbp-ivory/18 md:grid-cols-2">
                {automationExamples.map((example, index) => (
                  <div
                    key={example}
                    className="group border-b border-bvbp-ivory/18 py-5 transition-colors hover:bg-bvbp-ivory/[0.04] md:px-5"
                  >
                    <div className="flex items-start gap-5">
                      <span className="font-label text-xs font-medium text-bvbp-gold">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="text-base font-medium leading-7 text-bvbp-ivory/86 transition-colors group-hover:text-bvbp-ivory">
                        {example}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section
            id="quem-somos"
            className="bg-bvbp-raised py-16 lg:py-20"
          >
            <div className="container mx-auto px-4">
              <div className="mx-auto mb-12 max-w-4xl">
                <p className="mb-4 font-label text-xs font-medium uppercase text-bvbp-muted-ink">Quem somos</p>
                <h2 className="font-heading text-4xl font-medium leading-tight text-bvbp-ink md:text-5xl">
                  Você volta a ter tempo para pensar no negócio, não só na operação.
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-bvbp-muted-ink">
                  A BVBP cria uma rotina em que decisões, execução e evidências caminham juntas. O objetivo é clareza
                  para o time sustentar melhoria.
                </p>
              </div>

              <div className="mx-auto mb-14 grid max-w-5xl gap-8 md:grid-cols-2">
                {team.map((member) => (
                  <article key={member.name} className="rounded-md border border-bvbp-ink/10 bg-bvbp-ivory p-6 text-center transition-colors hover:border-bvbp-gold lg:p-8">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="mx-auto mb-6 h-52 w-52 rounded-md border border-bvbp-ink/10 object-cover grayscale"
                    />
                    <h3 className="font-heading text-2xl font-medium text-bvbp-ink">{member.name}</h3>
                    <p className="mt-3 leading-7 text-bvbp-muted-ink">{member.bio}</p>
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-2 font-medium text-bvbp-forest transition-colors hover:text-bvbp-gold"
                    >
                      <LinkedinIcon className="h-5 w-5" aria-hidden="true" />
                      <span>LinkedIn</span>
                    </a>
                  </article>
                ))}
              </div>

              <div className="mx-auto grid max-w-6xl border-t border-bvbp-ink/10 lg:grid-cols-3">
                {values.map((value, index) => (
                  <div key={value.title} className="border-b border-bvbp-ink/10 py-6 lg:border-b-0 lg:border-r lg:border-bvbp-ink/10 lg:px-6 lg:last:border-r-0">
                    <p className="font-label text-xs font-medium text-bvbp-gold">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-5 font-heading text-2xl font-medium text-bvbp-ink">{value.title}</h3>
                    <p className="mt-3 leading-7 text-bvbp-muted-ink">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section
            id="contato"
            className="bg-bvbp-ivory py-16 lg:py-20"
          >
            <div className="container mx-auto px-4">
              <div className="mb-12">
                <p className="mb-4 font-label text-xs font-medium uppercase text-bvbp-muted-ink">Contato</p>
                <h2 className="max-w-4xl font-heading text-4xl font-medium leading-tight text-bvbp-ink md:text-5xl">
                  Vamos entender qual ponteiro precisa mover.
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-bvbp-muted-ink">
                  Conte o contexto em poucas linhas. A primeira conversa serve para entender dor, urgência e se o
                  melhor próximo passo é Sprint, Partnership ou uma decisão interna mais clara.
                </p>
              </div>

              <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
                <div className="rounded-md border border-bvbp-ink/10 bg-bvbp-raised p-6 lg:p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-bvbp-ink">Nome completo *</Label>
                      <Input id="name" value={formData.name} onChange={(event) => handleInputChange("name", event.target.value)} placeholder="Seu nome completo" required className="border-bvbp-ink/15 bg-bvbp-ivory focus-visible:ring-bvbp-gold" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-bvbp-ink">Email *</Label>
                      <Input id="email" type="email" value={formData.email} onChange={(event) => handleInputChange("email", event.target.value)} placeholder="seu@email.com" required className="border-bvbp-ink/15 bg-bvbp-ivory focus-visible:ring-bvbp-gold" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-bvbp-ink">Telefone *</Label>
                      <Input id="phone" value={formData.phone} onChange={(event) => handleInputChange("phone", event.target.value)} placeholder="+55 51 99999-9999" required className="border-bvbp-ink/15 bg-bvbp-ivory focus-visible:ring-bvbp-gold" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-bvbp-ink">Empresa</Label>
                      <Input id="company" value={formData.company} onChange={(event) => handleInputChange("company", event.target.value)} placeholder="Nome da sua empresa" className="border-bvbp-ink/15 bg-bvbp-ivory focus-visible:ring-bvbp-gold" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-bvbp-ink">Cargo/Função</Label>
                      <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                        <SelectTrigger className="border-bvbp-ink/15 bg-bvbp-ivory focus:ring-bvbp-gold">
                          <SelectValue placeholder="Selecione seu cargo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ceo">CEO/Founder</SelectItem>
                          <SelectItem value="diretor">Diretor/Executivo</SelectItem>
                          <SelectItem value="gerente">Gerente/Coordenador</SelectItem>
                          <SelectItem value="especialista">Especialista</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="interest" className="text-bvbp-ink">Interesse</Label>
                      <Select value={formData.interest} onValueChange={(value) => handleInputChange("interest", value)}>
                        <SelectTrigger className="border-bvbp-ink/15 bg-bvbp-ivory focus:ring-bvbp-gold">
                          <SelectValue placeholder="Selecione uma oferta" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BVBP Performance Sprint">BVBP Performance Sprint</SelectItem>
                          <SelectItem value="BVBP Performance Partnership">BVBP Performance Partnership</SelectItem>
                          <SelectItem value="Portal BVBP">Portal BVBP</SelectItem>
                          <SelectItem value="Outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="challenge" className="text-bvbp-ink">O que precisa melhorar? *</Label>
                      <Textarea id="challenge" value={formData.challenge} onChange={(event) => handleInputChange("challenge", event.target.value)} placeholder="Ex.: margem, comercial, retrabalho, acompanhamento de execução..." rows={4} required className="border-bvbp-ink/15 bg-bvbp-ivory focus-visible:ring-bvbp-gold" />
                    </div>

                    <div className="flex items-center space-x-3">
                      <Checkbox id="consent" required />
                      <Label htmlFor="consent" className="text-sm text-bvbp-muted-ink">
                        Concordo que a BVBP entre em contato sobre minha solicitação.
                      </Label>
                    </div>

                    <Button type="submit" className="h-12 w-full rounded-md bg-bvbp-forest px-6 text-sm font-semibold text-bvbp-ivory shadow-none hover:bg-bvbp-forest-dark" disabled={isSubmitting}>
                      {isSubmitting ? "Enviando..." : "Agendar conversa"}
                    </Button>
                  </form>
                </div>

                <aside className="rounded-md border border-bvbp-ink/10 bg-bvbp-raised p-8">
                  <h3 className="font-heading text-3xl font-medium text-bvbp-ink">Fale direto conosco</h3>
                  <p className="mt-3 text-bvbp-muted-ink">Resposta em até 4 horas úteis.</p>

                  <div className="my-8 space-y-4">
                    {emails.map((item) => (
                      <a
                        key={item.email}
                        href={item.link}
                        className="flex items-center gap-3 text-lg font-medium text-bvbp-forest transition-colors hover:text-bvbp-gold"
                      >
                        <MailIcon className="h-5 w-5" aria-hidden="true" />
                        <span>{item.email}</span>
                      </a>
                    ))}
                  </div>

                  <div className="space-y-3">
                    {[
                      "Primeira conversa sem compromisso",
                      "Diagnóstico do contexto antes de qualquer ferramenta",
                      "Foco em potencial mapeado, evidência e próxima decisão",
                    ].map((benefit) => (
                      <div key={benefit} className="border-t border-bvbp-ink/10 py-3">
                        <span className="text-bvbp-ink">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </aside>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
