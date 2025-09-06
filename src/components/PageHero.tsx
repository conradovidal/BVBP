import { ReactNode } from "react";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  children?: ReactNode;
}

const PageHero = ({ title, subtitle, description, children }: PageHeroProps) => {
  return (
    <section className="relative py-20 lg:py-28 bg-gradient-hero overflow-hidden">
      <div className="absolute inset-0 bg-black/5"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 animate-fade-in">
            {title}
          </h1>
          {subtitle && (
            <h2 className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in [animation-delay:200ms]">
              {subtitle}
            </h2>
          )}
          {description && (
            <p className="text-lg text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in [animation-delay:400ms]">
              {description}
            </p>
          )}
          {children && (
            <div className="animate-fade-in [animation-delay:600ms]">
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PageHero;