import type { MaturityLevel } from "@/data/performanceSystem";

const segmentColors: Record<MaturityLevel, string> = {
  1: "bg-bvbp-positive/25",
  2: "bg-bvbp-positive/45",
  3: "bg-bvbp-positive/65",
  4: "bg-bvbp-positive",
  5: "bg-bvbp-gold",
};

const activeCardColors: Record<MaturityLevel, string> = {
  1: "border-bvbp-positive/25 bg-bvbp-positive/5 text-bvbp-ink",
  2: "border-bvbp-positive/40 bg-bvbp-positive/10 text-bvbp-ink",
  3: "border-bvbp-positive/55 bg-bvbp-positive/15 text-bvbp-ink",
  4: "border-bvbp-positive bg-bvbp-positive text-bvbp-ivory",
  5: "border-bvbp-gold bg-bvbp-gold text-bvbp-ink",
};

export function maturitySegmentClass(level: MaturityLevel) {
  return segmentColors[level];
}

export function maturityActiveCardClass(level: MaturityLevel) {
  return activeCardColors[level];
}
