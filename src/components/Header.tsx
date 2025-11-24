import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/vercel-tabs";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const navigationItems = [
    { id: "inicio", label: "Início", href: "#inicio" },
    { id: "quem-somos", label: "Quem Somos", href: "#quem-somos" },
    { id: "servicos", label: "Serviços", href: "#servicos" },
    { id: "contato", label: "Contato", href: "#contato" },
  ];

  // Scroll spy with IntersectionObserver
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-80px 0px -80% 0px', // Offset do header + threshold
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          const index = navigationItems.findIndex(item => item.id === sectionId);
          if (index !== -1) {
            setActiveTab(index);
            // Atualizar URL sem scroll
            window.history.replaceState(null, '', `#${sectionId}`);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observar todas as seções
    navigationItems.forEach(item => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // Initial hash on load
  useEffect(() => {
    const hash = window.location.hash || "#inicio";
    const currentIndex = navigationItems.findIndex(item => item.href === hash);
    if (currentIndex !== -1) {
      setActiveTab(currentIndex);
    }
  }, []);

  // Scroll progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Scroll Progress Bar */}
      <div 
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-bvbp-corporate via-bvbp-growth to-bvbp-corporate transition-all duration-300 shadow-success"
        style={{ width: `${scrollProgress}%` }}
      />
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
                const targetId = href.replace('#', '');
                const element = document.getElementById(targetId);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                  window.history.pushState(null, '', href);
                }
              }
            }}
            className="mx-4"
          />
        </nav>

        {/* CTA Button */}
        <div className="hidden md:block">
        <div className="flex items-center gap-3">
          <Button 
            variant="corporate"
            size="lg"
            className="px-4 py-2 text-sm whitespace-nowrap"
            onClick={() => {
              const element = document.getElementById('contato');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                window.history.pushState(null, '', '#contato');
              }
            }}
          >
            Diagnóstico Gratuito
          </Button>
          <Button 
            variant="outline"
            size="lg"
            className="px-4 py-2 text-sm whitespace-nowrap"
            onClick={() => window.location.href = '/calculadora-roi'}
          >
            Calculadora ROI
          </Button>
        </div>
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
                onClick={(e) => {
                  e.preventDefault();
                  const targetId = item.href.replace('#', '');
                  const element = document.getElementById(targetId);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                    window.history.pushState(null, '', item.href);
                    setIsMenuOpen(false);
                  }
                }}
              >
                {item.label}
              </a>
            ))}
            <Button 
              variant="corporate"
              size="lg"
              className="w-full text-sm"
              onClick={() => {
                const element = document.getElementById('contato');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                  window.history.pushState(null, '', '#contato');
                  setIsMenuOpen(false);
                }
              }}
            >
              Diagnóstico Gratuito
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="w-full text-sm"
              onClick={() => {
                window.location.href = '/calculadora-roi';
                setIsMenuOpen(false);
              }}
            >
              Calculadora ROI
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;