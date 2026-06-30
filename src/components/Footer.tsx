import { Button } from "@/components/ui/button";
import { ExternalLink, Instagram, Linkedin, Mail, MapPin } from "lucide-react";
import bvbpLockupDark from "@/assets/brand/bvbp-lockup-dark.svg";

const Footer = () => {
  const services = [
    "Performance Sprint",
    "Performance Partnership",
    "Método BVBP",
    "Plataforma BVBP",
    "Conteúdo",
  ];

  const links: Record<string, string> = {
    "Performance Sprint": "/#ofertas",
    "Performance Partnership": "/#ofertas",
    "Método BVBP": "/#metodo",
    "Plataforma BVBP": "/#plataforma",
    Conteúdo: "/blog",
  };

  return (
    <footer className="bg-bvbp-forest-dark text-bvbp-ivory">
      <div className="container mx-auto px-4 py-14">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <img src={bvbpLockupDark} alt="BVBP - Basso & Vidal Business Partners" className="mb-7 h-12 w-auto" />

            <p className="mb-7 max-w-md text-sm leading-6 text-bvbp-ivory/72">
              Performance operacional para empresas que querem crescer com controle.
            </p>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-bvbp-gold" />
                <a href="mailto:conrado@bvbp.com.br?subject=Contato%20BVBP" className="transition-smooth hover:text-bvbp-gold">
                  conrado@bvbp.com.br
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-bvbp-gold" />
                <a href="mailto:cristiano@bvbp.com.br?subject=Contato%20BVBP" className="transition-smooth hover:text-bvbp-gold">
                  cristiano@bvbp.com.br
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-bvbp-gold" />
                <span className="text-bvbp-ivory/72">Porto Alegre, RS - Brasil</span>
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <a
                href="#"
                className="rounded-md border border-bvbp-ivory/10 p-2 text-bvbp-ivory/75 transition-smooth hover:border-bvbp-gold hover:text-bvbp-gold"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="rounded-md border border-bvbp-ivory/10 p-2 text-bvbp-ivory/75 transition-smooth hover:border-bvbp-gold hover:text-bvbp-gold"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-label text-xs font-semibold uppercase text-bvbp-ivory/50">Método</h3>
            <div className="space-y-2">
              {services.map((service) => (
                <a
                  key={service}
                  href={links[service]}
                  className="block text-sm text-bvbp-ivory/72 transition-smooth hover:text-bvbp-gold"
                >
                  {service}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-label text-xs font-semibold uppercase text-bvbp-ivory/50">Empresa</h3>
            <div className="space-y-2">
              <a href="/#quem-somos" className="block text-bvbp-ivory/72 transition-smooth hover:text-bvbp-gold">
                Sobre Nós
              </a>
              <a href="/#contato" className="block text-bvbp-ivory/72 transition-smooth hover:text-bvbp-gold">
                Contato
              </a>
              <a href="/app" className="block text-bvbp-ivory/72 transition-smooth hover:text-bvbp-gold">
                Portal BVBP
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-y border-bvbp-ivory/10 bg-bvbp-forest">
        <div className="container mx-auto px-4 py-7">
          <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
            <div className="mb-4 md:mb-0">
              <h3 className="mb-1 font-heading text-2xl font-medium text-bvbp-ivory">
                Vamos identificar o ponteiro certo?
              </h3>
              <p className="text-sm text-bvbp-ivory/72">
                Uma conversa curta já deve clarear dor, urgência e próximo passo.
              </p>
            </div>
            <Button
              variant="outline"
              size="lg"
              className="border-bvbp-ivory/60 bg-transparent text-bvbp-ivory transition-smooth hover:bg-bvbp-ivory hover:text-bvbp-forest"
              onClick={() => {
                window.location.href = "/#contato";
              }}
            >
              Agendar conversa
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-bvbp-forest-dark">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col items-center justify-between text-sm text-bvbp-ivory/45 md:flex-row">
            <div>© 2026 BVBP - Basso & Vidal Business Partners. Todos os direitos reservados.</div>
            <div className="mt-2 md:mt-0">Feito em Porto Alegre.</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
