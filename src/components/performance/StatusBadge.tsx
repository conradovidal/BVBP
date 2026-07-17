import { cn } from "@/lib/utils";

type Tone = "green" | "orange" | "red" | "blue" | "lightBlue" | "gray";

const toneClasses: Record<Tone, string> = {
  green: "border-bvbp-positive/20 bg-bvbp-positive/10 text-bvbp-positive",
  orange: "border-bvbp-caution/20 bg-bvbp-caution/10 text-bvbp-caution",
  red: "border-bvbp-risk/20 bg-bvbp-risk/10 text-bvbp-risk",
  blue: "border-bvbp-signal/25 bg-bvbp-signal/10 text-bvbp-signal",
  lightBlue: "border-bvbp-signal/15 bg-bvbp-signal/5 text-bvbp-signal",
  gray: "border-bvbp-ink/10 bg-bvbp-inset text-bvbp-muted-ink",
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
        "font-label inline-flex min-h-6 items-center whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase leading-none tracking-[0.05em]",
        toneClasses[toneForLabel(label)],
        className
      )}
    >
      {label}
    </span>
  );
}
