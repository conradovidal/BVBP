import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/vercel-tabs";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  
  const isHomePage = location.pathname === "/";

  const navigationItems = [
    { id: "inicio", label: "Início", href: "#inicio" },
    { id: "servicos", label: "Serviços", href: "#servicos" },
    { id: "quem-somos", label: "Quem Somos", href: "#quem-somos" },
    { id: "contato", label: "Contato", href: "#contato" },
  ];

  // Navigate to section - handles both home and other pages
  const navigateToSection = (sectionId: string) => {
    if (isHomePage) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', `#${sectionId}`);
      }
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  // Scroll spy with IntersectionObserver - only active on home page
  useEffect(() => {
    if (!isHomePage) return;

    const observerOptions = {
      root: null,
      rootMargin: '-80px 0px -80% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          const index = navigationItems.findIndex(item => item.id === sectionId);
          if (index !== -1) {
            setActiveTab(index);
            window.history.replaceState(null, '', `#${sectionId}`);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    navigationItems.forEach(item => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [isHomePage]);

  // Initial hash on load
  useEffect(() => {
    if (!isHomePage) return;
    const hash = window.location.hash || "#inicio";
    const currentIndex = navigationItems.findIndex(item => item.href === hash);
    if (currentIndex !== -1) {
      setActiveTab(currentIndex);
    }
  }, [isHomePage]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center">
          <a href="/" className="font-heading text-2xl font-bold text-bvbp-corporate hover:text-bvbp-growth transition-smooth">
            BVBP
          </a>
          <div className="hidden lg:block text-xs leading-tight text-foreground/80 ml-3">
            <div>Basso & Vidal</div>
            <div>Business Partners</div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center">
          <Tabs
            tabs={navigationItems}
            activeTab={isHomePage ? navigationItems[activeTab]?.id : undefined}
            onTabChange={(tabId, href) => {
              if (href) {
                const targetId = href.replace('#', '');
                navigateToSection(targetId);
              }
            }}
            className="mx-4"
          />
        </nav>

        {/* CTA Button */}
        <div className="hidden lg:block">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline"
            size="lg"
            className="px-4 py-2 text-sm whitespace-nowrap"
            onClick={() => window.location.href = '/calculadora-roi'}
          >
            Calculadora ROI
          </Button>
          <Button 
            variant="corporate"
            size="lg"
            className="px-4 py-2 text-sm whitespace-nowrap"
            onClick={() => {
              if (isHomePage) {
                const element = document.getElementById('contato');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                  window.history.pushState(null, '', '#contato');
                }
              } else {
                navigate('/#contato');
              }
            }}
          >
            Diagnóstico Gratuito
          </Button>
        </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t bg-background">
          <nav className="container mx-auto px-4 py-4 space-y-4">
            {navigationItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block text-sm font-medium text-foreground hover:text-bvbp-corporate transition-smooth"
                onClick={(e) => {
                  e.preventDefault();
                  const targetId = item.href.replace('#', '');
                  navigateToSection(targetId);
                  setIsMenuOpen(false);
                }}
              >
                {item.label}
              </a>
            ))}
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
            <Button 
              variant="corporate"
              size="lg"
              className="w-full text-sm"
              onClick={() => {
                if (isHomePage) {
                  const element = document.getElementById('contato');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                    window.history.pushState(null, '', '#contato');
                  }
                } else {
                  navigate('/#contato');
                }
                setIsMenuOpen(false);
              }}
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