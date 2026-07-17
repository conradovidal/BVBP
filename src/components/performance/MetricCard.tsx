import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const railClasses = {
  blue: "before:bg-bvbp-forest",
  green: "before:bg-bvbp-positive",
  orange: "before:bg-bvbp-gold",
  gray: "before:bg-bvbp-muted-ink/45",
};

const markClasses = {
  blue: "bg-bvbp-forest",
  green: "bg-bvbp-positive",
  orange: "bg-bvbp-gold",
  gray: "bg-bvbp-muted-ink/45",
};

interface MetricCardProps {
  title: string;
  value: string;
  helper?: string;
  icon?: LucideIcon;
  accent?: keyof typeof railClasses;
  showHelper?: boolean;
  compact?: boolean;
}

export function MetricCard({ title, value, helper, accent = "blue", showHelper = false, compact = false }: MetricCardProps) {
  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised px-4 shadow-none",
        compact ? "py-3" : "py-4",
        "before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] before:rounded-l-[8px]",
        railClasses[accent]
      )}
    >
      <div className={cn("flex flex-col justify-between pl-1", compact ? "min-h-[58px] gap-2" : "min-h-[82px] gap-4")}>
        <div className="flex items-start justify-between gap-3">
          <p className="text-[13px] font-semibold leading-5 text-bvbp-muted-ink">{title}</p>
          <span className={cn("mt-2 h-px w-5 shrink-0 rounded-full opacity-80", markClasses[accent])} />
        </div>
        <div className="min-w-0">
          <p className={cn("font-heading font-semibold leading-none text-bvbp-ink", compact ? "text-xl sm:text-2xl" : "text-2xl sm:text-[1.7rem]")}>{value}</p>
          {showHelper && helper && <p className="mt-2 text-xs font-medium leading-5 text-bvbp-muted-ink">{helper}</p>}
        </div>
      </div>
    </article>
  );
}
