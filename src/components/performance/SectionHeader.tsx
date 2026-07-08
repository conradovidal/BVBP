interface SectionHeaderProps {
  title: string;
  description?: string;
}

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="space-y-1">
      <h2 className="font-heading text-xl font-semibold text-bvbp-ink">{title}</h2>
      {description && <p className="max-w-3xl text-sm leading-6 text-bvbp-muted-ink">{description}</p>}
    </div>
  );
}
