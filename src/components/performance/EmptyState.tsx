import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  className?: string;
}

export function EmptyState({ title, description, className }: EmptyStateProps) {
  return (
    <div className={cn("rounded-[8px] border border-dashed border-bvbp-ink/15 bg-bvbp-raised px-4 py-8 text-center", className)}>
      <p className="font-heading text-base font-semibold text-bvbp-ink">{title}</p>
      {description && <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-bvbp-muted-ink">{description}</p>}
    </div>
  );
}
