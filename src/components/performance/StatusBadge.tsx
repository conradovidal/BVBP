import { cn } from "@/lib/utils";

type Tone = "green" | "orange" | "red" | "blue" | "gray";

const toneClasses: Record<Tone, string> = {
  green: "text-bvbp-positive before:bg-bvbp-positive",
  orange: "text-bvbp-caution before:bg-bvbp-gold",
  red: "text-bvbp-risk before:bg-bvbp-risk",
  blue: "text-bvbp-forest before:bg-bvbp-forest",
  gray: "text-bvbp-muted-ink before:bg-bvbp-muted-ink/45",
};

function toneForLabel(label: string): Tone {
  if (["Ativo", "Baixo", "Baixa", "Alta", "Em andamento", "Executar", "Medir", "Padronizar", "Fazer agora", "Forte", "Real"].includes(label)) {
    return "green";
  }
  if (["Onboarding", "Médio", "Média", "Planejado", "Planejar", "Monitorar", "Atenção", "Testar", "Validar", "Aprender", "Em desenho", "Estimado"].includes(label)) {
    return "orange";
  }
  if (["Alto", "Atrasado"].includes(label)) return "red";
  if (["Pausar", "Pausado", "Mockado"].includes(label)) return "gray";
  return "blue";
}

interface StatusBadgeProps {
  label: string;
  className?: string;
}

export function StatusBadge({ label, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "font-label inline-flex items-center gap-1.5 whitespace-nowrap text-[11px] font-medium uppercase leading-none tracking-[0.04em]",
        "before:block before:h-1.5 before:w-1.5 before:rounded-full",
        toneClasses[toneForLabel(label)],
        className
      )}
    >
      {label}
    </span>
  );
}
