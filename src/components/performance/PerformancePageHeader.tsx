interface PerformancePageHeaderProps {
  title: string;
  description: string;
  showTitle?: boolean;
}

export function PerformancePageHeader({
  title,
  description,
  showTitle = true,
}: PerformancePageHeaderProps) {
  return (
    <section className="shrink-0 space-y-1">
      {showTitle ? <h1 className="font-heading text-2xl font-bold text-bvbp-ink sm:text-3xl">{title}</h1> : null}
      <p className="max-w-2xl text-sm leading-5 text-bvbp-muted-ink">{description}</p>
    </section>
  );
}
