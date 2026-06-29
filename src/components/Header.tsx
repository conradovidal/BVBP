import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const serviceRoutes = [
  "/diagnostico-operacional",
  "/sprint-otimizacao",
  "/gestao-projetos",
  "/retainer-governanca",
  "/programa-customizado",
  "/comparativo-servicos",
];

type ServiceLink =
  | { title: string; href: string; duration?: string; separator?: false }
  | { separator: true; title?: never; href?: never; duration?: never };

const serviceLinks: ServiceLink[] = [
  { title: "Diagnóstico Operacional", href: "/diagnostico-operacional", duration: "1 semana" },
  { title: "Otimização de Processo", href: "/sprint-otimizacao", duration: "2 semanas" },
  { title: "Gestão de Projetos", href: "/gestao-projetos", duration: "3-4 semanas" },
  { title: "Governança de Execução", href: "/retainer-governanca", duration: "Mensal" },
  { title: "Programa Customizado", href: "/programa-customizado", duration: "6-12 semanas" },
  { separator: true },
  { title: "Comparar Serviços", href: "/comparativo-servicos" },
];

const navigationItems = [
  { id: "inicio", label: "Início", href: "#inicio" },
  { id: "servicos", label: "Serviços", href: "#servicos", hasDropdown: true },
  { id: "quem-somos", label: "Quem Somos", href: "#quem-somos" },
  { id: "contato", label: "Contato", href: "#contato" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isHomePage = location.pathname === "/";
  const isServicePage = serviceRoutes.includes(location.pathname);

  // Force active tab to "Serviços" when on a service page
  useEffect(() => {
    if (isServicePage) {
      setActiveTab(1);
    }
  }, [isServicePage]);

  const navigateToSection = useCallback((sectionId: string) => {
    if (isHomePage) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', `#${sectionId}`);
      }
    } else {
      navigate(`/#${sectionId}`);
    }
  }, [isHomePage, navigate]);

  // Scroll spy - only on home page
  useEffect(() => {
    if (!isHomePage) return;

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

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '-80px 0px -80% 0px',
      threshold: 0,
    });

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
    if (currentIndex !== -1) setActiveTab(currentIndex);
  }, [isHomePage]);

  const handleDropdownEnter = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setIsServicesOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setIsServicesOpen(false), 150);
  };

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
          <div className="flex items-center relative">
            {navigationItems.map((item, index) => {
              const isActive = activeTab === index;

              if (item.hasDropdown) {
                return (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <button
                      onClick={() => navigateToSection(item.id)}
                      className={`
                        relative px-4 py-2 text-sm font-medium transition-colors duration-200
                        flex items-center gap-1
                        ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}
                      `}
                    >
                      {item.label}
                      <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} />
                      {isActive && (
                        <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-foreground rounded-full" />
                      )}
                    </button>

                    {/* Dropdown */}
                    <div
                      className={`
                        absolute top-full left-1/2 -translate-x-1/2 pt-2
                        transition-all duration-200 ease-out
                        ${isServicesOpen
                          ? 'opacity-100 translate-y-0 pointer-events-auto'
                          : 'opacity-0 translate-y-1 pointer-events-none'}
                      `}
                    >
                      <div className="bg-background rounded-lg shadow-lg border border-border/50 py-2 min-w-[280px]">
                        {serviceLinks.map((service, i) => {
                          if (service.separator) {
                            return <div key={i} className="my-1.5 border-t border-border/50" />;
                          }
                          const isCurrent = location.pathname === service.href;
                          return (
                            <button
                              key={service.href}
                              onClick={() => {
                                navigate(service.href);
                                setIsServicesOpen(false);
                              }}
                              className={`
                                w-full text-left px-4 py-2.5 text-sm transition-colors duration-150
                                flex items-center justify-between gap-4
                                ${isCurrent
                                  ? 'bg-accent text-accent-foreground font-medium'
                                  : 'text-foreground/80 hover:bg-accent/50 hover:text-foreground'}
                              `}
                            >
                              <span>{service.title}</span>
                              {service.duration && (
                                <span className="text-xs text-muted-foreground whitespace-nowrap">{service.duration}</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => navigateToSection(item.id)}
                  className={`
                    relative px-4 py-2 text-sm font-medium transition-colors duration-200
                    ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}
                  `}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-foreground rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden lg:block">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="lg"
              className="px-4 py-2 text-sm whitespace-nowrap"
              onClick={() => window.location.href = '/login'}
            >
              Entrar
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-4 py-2 text-sm whitespace-nowrap"
              onClick={() => window.location.href = '/blog'}
            >
              Conteúdo
            </Button>
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
              Agendar uma Conversa
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
          <nav className="container mx-auto px-4 py-4 space-y-1">
            {navigationItems.map((item) => {
              if (item.hasDropdown) {
                return (
                  <div key={item.id}>
                    <button
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                      className="flex items-center justify-between w-full py-3 text-sm font-medium text-foreground"
                    >
                      {item.label}
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileServicesOpen && (
                      <div className="pl-4 pb-2 space-y-1">
                        {serviceLinks.map((service, i) => {
                          if (service.separator) return null;
                          const isCurrent = location.pathname === service.href;
                          return (
                            <button
                              key={service.href}
                              onClick={() => {
                                navigate(service.href);
                                setIsMenuOpen(false);
                                setMobileServicesOpen(false);
                              }}
                              className={`
                                block w-full text-left py-2 text-sm transition-colors
                                ${isCurrent ? 'text-bvbp-corporate font-medium' : 'text-muted-foreground'}
                              `}
                            >
                              {service.title}
                              {service.duration && (
                                <span className="text-xs text-muted-foreground ml-2">· {service.duration}</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <a
                  key={item.id}
                  href={item.href}
                  className="block py-3 text-sm font-medium text-foreground hover:text-bvbp-corporate transition-smooth"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateToSection(item.id.replace('#', ''));
                    setIsMenuOpen(false);
                  }}
                >
                  {item.label}
                </a>
              );
            })}
            <div className="pt-3 space-y-2">
              <Button
                variant="outline"
                size="lg"
                className="w-full text-sm"
                onClick={() => {
                  window.location.href = '/login';
                  setIsMenuOpen(false);
                }}
              >
                Entrar
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full text-sm"
                onClick={() => {
                  window.location.href = '/blog';
                  setIsMenuOpen(false);
                }}
              >
                Conteúdo
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
                Agendar uma Conversa
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
