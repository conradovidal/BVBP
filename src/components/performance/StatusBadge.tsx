import { cn } from "@/lib/utils";

type Tone = "green" | "orange" | "red" | "blue" | "lightBlue" | "gray";

const toneClasses: Record<Tone, string> = {
  green: "text-bvbp-positive before:bg-bvbp-positive",
  orange: "text-bvbp-caution before:bg-bvbp-caution",
  red: "text-bvbp-risk before:bg-bvbp-risk",
  blue: "text-bvbp-forest before:bg-bvbp-forest",
  lightBlue: "text-bvbp-signal before:bg-bvbp-signal/65",
  gray: "text-bvbp-muted-ink before:bg-bvbp-muted-ink/45",
};

function toneForLabel(label: string): Tone {
  if (["Ativo", "Baixo", "Baixa", "Alta", "Em andamento", "Fazer agora", "Forte", "Real", "Informado", "Concluída"].includes(label)) {
    return "green";
  }
  if (["Em desenvolvimento"].includes(label)) return "blue";
  if (["Em validação"].includes(label)) return "lightBlue";
  if (["Alto", "Atrasado", "Atenção", "Tensão", "Descartada", "Fonte pendente"].includes(label)) return "red";
  if (["Em refinamento", "Arquivada", "Pausar", "Pausado", "Mockado", "Estimado", "Sem baseline", "Sem ponteiros", "Crítico a definir"].includes(label)) return "gray";
  if (["Médio", "Média", "Monitorar"].includes(label)) return "orange";
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
