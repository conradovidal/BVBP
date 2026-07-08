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
}

export function MetricCard({ title, value, helper, accent = "blue", showHelper = false }: MetricCardProps) {
  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised px-4 py-4 shadow-none",
        "before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] before:rounded-l-[8px]",
        railClasses[accent]
      )}
    >
      <div className="flex min-h-[82px] flex-col justify-between gap-4 pl-1">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[13px] font-semibold leading-5 text-bvbp-muted-ink">{title}</p>
          <span className={cn("mt-2 h-px w-5 shrink-0 rounded-full opacity-80", markClasses[accent])} />
        </div>
        <div className="min-w-0">
          <p className="font-heading text-2xl font-semibold leading-none text-bvbp-ink sm:text-[1.7rem]">{value}</p>
          {showHelper && helper && <p className="mt-2 text-xs font-medium leading-5 text-bvbp-muted-ink">{helper}</p>}
        </div>
      </div>
    </article>
  );
}
