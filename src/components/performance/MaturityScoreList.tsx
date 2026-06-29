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
          <article key={score.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h3 className="font-semibold text-[#1B365D]">{score.dimension}</h3>
                <p className="mt-1 text-sm leading-5 text-slate-600">{score.description}</p>
              </div>
              <span className="shrink-0 rounded-md bg-slate-100 px-2.5 py-1 text-sm font-bold text-[#1B365D]">
                {score.score}/5
              </span>
            </div>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-[#38A169]" style={{ width: `${percentage}%` }} />
            </div>
          </article>
        );
      })}
    </div>
  );
}
