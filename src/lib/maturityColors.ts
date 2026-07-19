import type { MaturityLevel } from "@/data/performanceSystem";

const segmentColors: Record<MaturityLevel, string> = {
  1: "bg-bvbp-forest/25",
  2: "bg-bvbp-forest/45",
  3: "bg-bvbp-forest/65",
  4: "bg-bvbp-forest",
  5: "bg-bvbp-gold",
};

const activeCardColors: Record<MaturityLevel, string> = {
  1: "border-bvbp-forest/20 bg-bvbp-forest/5 text-bvbp-ink",
  2: "border-bvbp-forest/35 bg-bvbp-forest/10 text-bvbp-ink",
  3: "border-bvbp-forest/55 bg-bvbp-forest/15 text-bvbp-ink",
  4: "border-bvbp-forest bg-bvbp-forest text-bvbp-ivory",
  5: "border-bvbp-gold bg-bvbp-gold text-bvbp-ink",
};

export function maturitySegmentClass(level: MaturityLevel) {
  return segmentColors[level];
}

export function maturityActiveCardClass(level: MaturityLevel) {
  return activeCardColors[level];
}
