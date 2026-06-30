import type { MaturityScore } from "@/data/performanceSystem";

interface MaturityScoreListProps {
  scores: MaturityScore[];
}

export function MaturityScoreList({ scores }: MaturityScoreListProps) {
  return (
    <div className="grid gap-3">
      {scores.map((score) => {
        const percentage = (score.score / 5) * 100;

        return (
          <article key={score.id} className="rounded-[8px] border border-bvbp-ink/10 bg-bvbp-raised p-4 shadow-none">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h3 className="font-semibold text-bvbp-ink">{score.dimension}</h3>
                <p className="mt-1 text-sm leading-5 text-bvbp-muted-ink">{score.description}</p>
              </div>
              <span className="shrink-0 rounded-md bg-bvbp-inset px-2.5 py-1 text-sm font-bold text-bvbp-ink">
                {score.score}/5
              </span>
            </div>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-bvbp-inset">
              <div className="h-full rounded-full bg-bvbp-positive" style={{ width: `${percentage}%` }} />
            </div>
          </article>
        );
      })}
    </div>
  );
}
