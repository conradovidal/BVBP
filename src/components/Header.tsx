import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { BrandLockup } from "@/components/BrandLockup";
import { Button } from "@/components/ui/button";

const sectionLinks = [
  { id: "metodo", label: "Método", href: "#metodo" },
  { id: "plataforma", label: "Plataforma", href: "#plataforma" },
  { id: "ofertas", label: "Ofertas", href: "#ofertas" },
  { id: "contato", label: "Contato", href: "#contato" },
] as const;

const contentLink = { label: "Conteúdo", href: "/blog" } as const;
const portalLink = { label: "Portal BVBP", href: "/app" } as const;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    if (!isHomePage) return;

    const ids = ["inicio", ...sectionLinks.map((item) => item.id)];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            window.history.replaceState(null, "", `#${entry.target.id}`);
          }
        });
      },
      {
        root: null,
        rootMargin: "-80px 0px -75% 0px",
        threshold: 0,
      },
    );

    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [isHomePage]);

  useEffect(() => {
    if (!isHomePage) return;
    const hash = window.location.hash.replace("#", "");
    if (hash) setActiveSection(hash);
  }, [isHomePage]);

  const navigateToSection = (sectionId: string) => {
    if (isHomePage) {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", `#${sectionId}`);
    } else {
      navigate(`/#${sectionId}`);
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-bvbp-ink/10 bg-bvbp-ivory/95 backdrop-blur supports-[backdrop-filter]:bg-bvbp-ivory/90">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80" aria-label="BVBP">
          <BrandLockup tone="dark" size="md" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegação principal">
          {sectionLinks.slice(0, 3).map((item) => {
            const isActive = isHomePage && activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigateToSection(item.id)}
                className={`relative px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive ? "text-bvbp-forest" : "text-bvbp-muted-ink hover:text-bvbp-ink"
                }`}
              >
                {item.label}
                {isActive && <span className="absolute bottom-0 left-4 right-4 h-px bg-bvbp-gold" />}
              </button>
            );
          })}
          <Link
            className="px-4 py-2 text-sm font-semibold text-bvbp-muted-ink transition-colors hover:text-bvbp-ink"
            to={contentLink.href}
          >
            {contentLink.label}
          </Link>
          <button
            onClick={() => navigateToSection("contato")}
            className="px-4 py-2 text-sm font-semibold text-bvbp-muted-ink transition-colors hover:text-bvbp-ink"
          >
            Contato
          </button>
          <Button asChild variant="outline" size="sm" className="ml-2 rounded-md border-bvbp-forest bg-transparent text-bvbp-forest hover:bg-bvbp-forest hover:text-bvbp-ivory">
            <Link to={portalLink.href}>{portalLink.label}</Link>
          </Button>
        </nav>

        <button
          className="rounded-md p-2 text-bvbp-forest transition-colors hover:bg-bvbp-inset lg:hidden"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-bvbp-ink/10 bg-bvbp-ivory lg:hidden">
          <nav className="container mx-auto px-4 py-4" aria-label="Navegação mobile">
            <div className="space-y-1">
              {sectionLinks.slice(0, 3).map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigateToSection(item.id)}
                  className="block w-full rounded-md px-2 py-3 text-left text-sm font-semibold text-bvbp-forest transition-colors hover:bg-bvbp-inset"
                >
                  {item.label}
                </button>
              ))}
              <Link
                to={contentLink.href}
                onClick={() => setIsMenuOpen(false)}
                className="block rounded-md px-2 py-3 text-sm font-semibold text-bvbp-forest transition-colors hover:bg-bvbp-inset"
              >
                {contentLink.label}
              </Link>
              <button
                onClick={() => navigateToSection("contato")}
                className="block w-full rounded-md px-2 py-3 text-left text-sm font-semibold text-bvbp-forest transition-colors hover:bg-bvbp-inset"
              >
                Contato
              </button>
              <Button asChild variant="outline" className="mt-3 w-full rounded-md border-bvbp-forest bg-transparent text-bvbp-forest hover:bg-bvbp-forest hover:text-bvbp-ivory">
                <Link to={portalLink.href} onClick={() => setIsMenuOpen(false)}>
                  {portalLink.label}
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
