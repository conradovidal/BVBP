import { Button } from "@/components/ui/button";
import { MapPin, Mail, Phone, Linkedin, Instagram, ExternalLink } from "lucide-react";

const Footer = () => {
  const services = [
    "Quick Win",
    "Momentum", 
    "Transformation",
    "Retainer"
  ];

  const company = [
    "Sobre Nós",
    "Contato",
    "Diagnóstico Gratuito"
  ];

  return (
    <footer className="bg-bvbp-corporate text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="font-heading text-2xl font-bold mb-1">BVBP</div>
              <div className="text-white/90 font-medium">
                Basso & Vidal Business Partners
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-bvbp-growth" />
                <a href="mailto:basso.vidal.bp@gmail.com" className="hover:text-bvbp-growth transition-smooth">
                  basso.vidal.bp@gmail.com
                </a>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-bvbp-growth" />
                  <a href="tel:+5551996535711" className="hover:text-bvbp-growth transition-smooth">
                    +55 51 99653-5711
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-bvbp-growth" />
                  <a href="tel:+5551998991771" className="hover:text-bvbp-growth transition-smooth">
                    +55 51 99899-1771
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-bvbp-growth" />
                <span className="text-white/80">Porto Alegre, RS - Brasil</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4 mt-6">
              <a 
                href="#" 
                className="p-2 rounded-full bg-white/10 hover:bg-bvbp-growth transition-smooth"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="p-2 rounded-full bg-white/10 hover:bg-bvbp-growth transition-smooth"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-4">Serviços</h3>
            <div className="space-y-2">
              {services.map((service, index) => (
                <a
                  key={index}
                  href="/servicos"
                  className="block text-white/80 hover:text-bvbp-growth transition-smooth"
                >
                  {service}
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-4">Empresa</h3>
            <div className="space-y-2">
              <a href="/sobre" className="block text-white/80 hover:text-bvbp-growth transition-smooth">
                Sobre Nós
              </a>
              <a href="/contato" className="block text-white/80 hover:text-bvbp-growth transition-smooth">
                Contato
              </a>
              <a href="/" className="block text-white/80 hover:text-bvbp-growth transition-smooth">
                Diagnóstico Gratuito
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Strip */}
      <div className="bg-bvbp-growth">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="font-heading text-lg font-bold text-white mb-1">
                Queremos ser parceiros do seu crescimento. Vamos conversar?
              </h3>
              <p className="text-white/90 text-sm">
                Comece com nosso diagnóstico gratuito hoje mesmo
              </p>
            </div>
            <Button 
              variant="outline"
              size="lg"
              className="border-white text-white bg-transparent hover:bg-white hover:text-bvbp-growth transition-smooth"
            >
              Diagnóstico Gratuito
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-bvbp-corporate-dark border-t border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-white/60">
            <div>
              © 2024 BVBP - Basso & Vidal Business Partners. Todos os direitos reservados.
            </div>
            <div className="mt-2 md:mt-0">
              <span>Feito com</span> <span className="text-red-400">♥</span> <span>em Porto Alegre</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;