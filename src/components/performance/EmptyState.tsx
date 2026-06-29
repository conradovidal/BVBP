import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  className?: string;
}

export function EmptyState({ title, description, className }: EmptyStateProps) {
  return (
    <div className={cn("rounded-[8px] border border-dashed border-slate-200 bg-white px-4 py-8 text-center", className)}>
      <p className="font-heading text-base font-bold text-[#1B365D]">{title}</p>
      {description && <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</p>}
    </div>
  );
}
