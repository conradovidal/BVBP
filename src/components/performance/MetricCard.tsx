import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const railClasses = {
  blue: "before:bg-[#1B365D]",
  green: "before:bg-[#38A169]",
  orange: "before:bg-[#ED8936]",
  gray: "before:bg-slate-400",
};

const markClasses = {
  blue: "bg-[#1B365D]",
  green: "bg-[#38A169]",
  orange: "bg-[#ED8936]",
  gray: "bg-slate-400",
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
        "relative overflow-hidden rounded-[8px] border border-slate-200/80 bg-white px-4 py-4 shadow-[0_1px_0_rgba(15,23,42,0.03)]",
        "before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] before:rounded-l-[8px]",
        railClasses[accent]
      )}
    >
      <div className="flex min-h-[82px] flex-col justify-between gap-4 pl-1">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[13px] font-semibold leading-5 text-[#1B365D]/70">{title}</p>
          <span className={cn("mt-2 h-px w-5 shrink-0 rounded-full opacity-80", markClasses[accent])} />
        </div>
        <div className="min-w-0">
          <p className="font-heading text-2xl font-bold leading-none text-[#1B365D] sm:text-[1.7rem]">{value}</p>
          {showHelper && helper && <p className="mt-2 text-xs font-medium leading-5 text-slate-500">{helper}</p>}
        </div>
      </div>
    </article>
  );
}
