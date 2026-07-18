import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/performance/StatusBadge";
import { type PdcaStatus, pdcaStatuses } from "@/data/performanceSystem";
import { cn } from "@/lib/utils";

interface InitiativeStatusMenuProps {
  status: PdcaStatus;
  onChange: (status: PdcaStatus) => void;
  className?: string;
}

export function InitiativeStatusMenu({ status, onChange, className }: InitiativeStatusMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn(
            "h-8 justify-end gap-1 rounded-full border-0 bg-transparent px-1 text-xs font-semibold text-bvbp-ink shadow-none hover:bg-transparent",
            className,
          )}
          aria-label={`Alterar status: ${status}`}
        >
          <StatusBadge label={status} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-44 rounded-[8px] border-bvbp-ink/10 bg-bvbp-raised p-1 text-bvbp-ink shadow-[0_18px_50px_rgba(26,25,23,0.12)]"
      >
        {pdcaStatuses.map((item) => (
          <DropdownMenuItem
            key={item}
            onClick={() => onChange(item)}
            className="cursor-pointer items-center justify-between rounded-[8px] px-3 py-2 text-sm focus:bg-bvbp-inset focus:text-bvbp-ink"
          >
            <StatusBadge label={item} />
            {item === status && <Check className="h-4 w-4 text-bvbp-forest" aria-hidden="true" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
