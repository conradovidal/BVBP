import { cn } from "@/lib/utils";

type Tone = "green" | "orange" | "red" | "blue" | "gray";

const toneClasses: Record<Tone, string> = {
  green: "text-[#2F855A] before:bg-[#38A169]",
  orange: "text-[#C05621] before:bg-[#ED8936]",
  red: "text-red-700 before:bg-red-500",
  blue: "text-[#1B365D] before:bg-[#1B365D]",
  gray: "text-slate-600 before:bg-slate-400",
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
        "inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold leading-none",
        "before:block before:h-1.5 before:w-1.5 before:rounded-full",
        toneClasses[toneForLabel(label)],
        className
      )}
    >
      {label}
    </span>
  );
}
