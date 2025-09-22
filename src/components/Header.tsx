import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/vercel-tabs";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const navigationItems = [
    { id: "home", label: "Início", href: "/" },
    { id: "about", label: "Quem Somos", href: "/sobre" },
    { id: "calculator", label: "Calculadora", href: "/calculadora-roi" },
    { id: "services", label: "Serviços", href: "/servicos" },
    { id: "contact", label: "Contato", href: "/contato" },
  ];

  useEffect(() => {
    const updateActiveTab = () => {
      const currentPath = window.location.pathname;
      const currentIndex = navigationItems.findIndex(item => item.href === currentPath);
      if (currentIndex !== -1) {
        setActiveTab(currentIndex);
      }
    };

    updateActiveTab();
    
    // Listen for route changes
    window.addEventListener('popstate', updateActiveTab);
    
    return () => {
      window.removeEventListener('popstate', updateActiveTab);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center">
          <a href="/" className="font-heading text-2xl font-bold text-bvbp-corporate hover:text-bvbp-growth transition-smooth">
            BVBP
          </a>
          <div className="hidden md:block text-xs leading-tight text-foreground/80 ml-3">
            <div>Basso & Vidal</div>
            <div>Business Partners</div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center">
          <Tabs
            tabs={navigationItems}
            activeTab={navigationItems[activeTab]?.id}
            onTabChange={(tabId, href) => {
              if (href) {
                window.location.href = href;
              }
            }}
            className="mx-4"
          />
        </nav>

        {/* CTA Button */}
        <div className="hidden md:block">
        <Button 
          variant="corporate"
          size="lg"
          className="px-4 py-2 text-sm whitespace-nowrap"
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
              variant="corporate"
              size="lg"
              className="w-full text-sm"
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