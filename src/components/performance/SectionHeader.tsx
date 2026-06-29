interface SectionHeaderProps {
  title: string;
  description?: string;
}

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="space-y-1">
      <h2 className="font-heading text-xl font-bold text-[#1B365D]">{title}</h2>
      {description && <p className="max-w-3xl text-sm leading-6 text-slate-600">{description}</p>}
    </div>
  );
}
