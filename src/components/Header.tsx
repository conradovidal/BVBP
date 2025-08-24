import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { label: "Início", href: "/" },
    { label: "Sobre", href: "/sobre" },
    { label: "Serviços", href: "/servicos" },
    { label: "Calculadora ROI", href: "/calculadora-roi" },
    { label: "Contato", href: "/contato" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center">
          <a href="/" className="font-heading text-2xl font-bold text-bvbp-corporate hover:text-bvbp-growth transition-smooth mr-3">
            BVBP
          </a>
          <div className="text-xs leading-tight text-foreground/80">
            <div>Basso & Vidal</div>
            <div>Business Partners</div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navigationItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-foreground hover:text-bvbp-corporate transition-smooth"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:block">
        <Button 
          className="bg-bvbp-growth hover:bg-bvbp-growth-dark text-white border-bvbp-growth hover:border-bvbp-growth-dark" 
          size="lg"
          onClick={() => window.location.href = '/contato'}
        >
          Diagnóstico Gratuito
        </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container mx-auto px-4 py-4 space-y-4">
            {navigationItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block text-sm font-medium text-foreground hover:text-bvbp-corporate transition-smooth"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Button 
              className="bg-bvbp-growth hover:bg-bvbp-growth-dark text-white w-full border-bvbp-growth hover:border-bvbp-growth-dark" 
              size="lg"
              onClick={() => window.location.href = '/contato'}
            >
              Diagnóstico Gratuito
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;