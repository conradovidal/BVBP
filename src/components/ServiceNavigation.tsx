import { Link, useLocation } from "react-router-dom";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const allServices = [
  {
    slug: "diagnostico-operacional",
    title: "Diagnóstico Operacional",
    shortTitle: "Diagnóstico",
    duration: "1 semana",
  },
  {
    slug: "sprint-otimizacao",
    title: "Sprint de Otimização de Processo",
    shortTitle: "Sprint",
    duration: "2 semanas",
  },
  {
    slug: "gestao-projetos",
    title: "Configuração de Gestão e Entrega de Projetos",
    shortTitle: "Gestão de Projetos",
    duration: "3-4 semanas",
  },
  {
    slug: "retainer-governanca",
    title: "Retainer de Execução e Governança",
    shortTitle: "Retainer",
    duration: "Mensal",
  },
  {
    slug: "programa-customizado",
    title: "Programa Customizado de Melhoria",
    shortTitle: "Programa Customizado",
    duration: "6-12 semanas",
  },
];

interface ServiceBreadcrumbProps {
  currentTitle: string;
}

export const ServiceBreadcrumb = ({ currentTitle }: ServiceBreadcrumbProps) => {
  return (
    <div className="bg-gray-50 border-b border-gray-200 pt-20">
      <div className="container mx-auto px-4 py-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="text-muted-foreground hover:text-foreground">
                  Início
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/#servicos" className="text-muted-foreground hover:text-foreground">
                  Serviços
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-foreground font-medium">
                {currentTitle}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
};

export const OtherServicesSection = () => {
  const location = useLocation();
  const currentSlug = location.pathname.replace("/", "");
  
  const otherServices = allServices.filter(
    (service) => service.slug !== currentSlug
  );

  return (
    <section className="py-12 lg:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
            Outros serviços
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {otherServices.map((service) => (
              <Link key={service.slug} to={`/${service.slug}`}>
                <Card className="p-4 h-full hover:border-primary/50 hover:shadow-md transition-all group">
                  <p className="text-xs text-muted-foreground mb-1">{service.duration}</p>
                  <h3 className="font-heading text-sm font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                    {service.shortTitle}
                  </h3>
                  <div className="flex items-center text-primary text-xs">
                    <span>Ver mais</span>
                    <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
