import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  children?: ReactNode;
  icon?: LucideIcon;
}

const PageHero = ({ title, subtitle, description, children, icon: Icon }: PageHeroProps) => {
  return (
    <section className="relative py-20 lg:py-28 bg-gradient-hero overflow-hidden">
      <div className="absolute inset-0 bg-black/5"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {Icon && (
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-bvbp-growth mb-8 shadow-success animate-fade-in">
              <Icon className="h-10 w-10 text-white" />
            </div>
          )}
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 animate-fade-in [animation-delay:200ms]">
            {title}
          </h1>
          {subtitle && (
            <h2 className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in [animation-delay:400ms]">
              {subtitle}
            </h2>
          )}
          {description && (
            <p className="text-lg text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in [animation-delay:600ms]">
              {description}
            </p>
          )}
          {children && (
            <div className="animate-fade-in [animation-delay:800ms]">
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PageHero;