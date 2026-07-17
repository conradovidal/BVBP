import { ArrowDown, ArrowUp, Check, ChevronDown, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { initiativePriorities, type InitiativePriority } from "@/data/performanceSystem";
import { cn } from "@/lib/utils";

const priorityMeta = {
  Alta: { icon: ArrowUp, className: "text-bvbp-risk" },
  Média: { icon: Minus, className: "text-bvbp-caution" },
  Baixa: { icon: ArrowDown, className: "text-bvbp-muted-ink" },
} satisfies Record<InitiativePriority, { icon: typeof ArrowUp; className: string }>;

interface InitiativePriorityMenuProps {
  priority?: InitiativePriority;
  canManage: boolean;
  onChange: (priority: InitiativePriority) => void;
}

export function InitiativePriorityMenu({ priority, canManage, onChange }: InitiativePriorityMenuProps) {
  const current = priority ? priorityMeta[priority] : null;
  const CurrentIcon = current?.icon;

  if (!canManage) {
    return (
      <span className={cn("inline-flex items-center gap-1.5 text-xs font-semibold", current?.className || "text-bvbp-muted-ink")}>
        {CurrentIcon ? <CurrentIcon className="h-4 w-4" aria-hidden="true" /> : null}
        {priority || "A definir"}
      </span>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" size="sm" className="h-8 justify-start gap-1.5 px-2" aria-label={`Alterar prioridade: ${priority || "A definir"}`}>
          {CurrentIcon ? <CurrentIcon className={cn("h-4 w-4", current.className)} aria-hidden="true" /> : null}
          <span className="text-xs font-semibold">{priority || "A definir"}</span>
          <ChevronDown className="h-3.5 w-3.5 text-bvbp-muted-ink" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {initiativePriorities.map((item) => {
          const meta = priorityMeta[item];
          const Icon = meta.icon;
          return (
            <DropdownMenuItem key={item} onClick={() => onChange(item)} className="justify-between">
              <span className="flex items-center gap-2">
                <Icon className={cn("h-4 w-4", meta.className)} aria-hidden="true" />
                {item}
              </span>
              {item === priority ? <Check className="h-4 w-4 text-bvbp-forest" aria-hidden="true" /> : null}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
