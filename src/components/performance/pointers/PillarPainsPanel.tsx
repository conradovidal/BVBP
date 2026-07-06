interface PillarPainsPanelProps {
  pains: string[];
}

export function PillarPainsPanel({ pains }: PillarPainsPanelProps) {
  return (
    <article className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-5">
      <p className="font-label text-xs font-semibold uppercase tracking-[0.08em] text-bvbp-muted-ink">
        Dores registradas
      </p>

      {pains.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {pains.map((pain) => (
            <span key={pain} className="rounded-[8px] bg-bvbp-inset px-3 py-2 text-sm font-medium text-bvbp-ink">
              {pain}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm leading-6 text-bvbp-muted-ink">Nenhuma dor registrada para este pilar.</p>
      )}
    </article>
  );
}
