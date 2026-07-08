import bvbpMark from "@/assets/brand/bvbp-mark.svg";
import { cn } from "@/lib/utils";

type BrandLockupTone = "dark" | "light";
type BrandLockupSize = "sm" | "md" | "lg";

interface BrandLockupProps {
  tone?: BrandLockupTone;
  size?: BrandLockupSize;
  className?: string;
}

const sizeClasses: Record<BrandLockupSize, { mark: string; name: string; subtitle: string; gap: string }> = {
  sm: {
    mark: "h-7 w-7",
    name: "text-base",
    subtitle: "text-[7px]",
    gap: "gap-2",
  },
  md: {
    mark: "h-9 w-9",
    name: "text-lg",
    subtitle: "text-[8px]",
    gap: "gap-2",
  },
  lg: {
    mark: "h-10 w-10",
    name: "text-xl",
    subtitle: "text-[8px]",
    gap: "gap-2.5",
  },
};

export function BrandLockup({ tone = "dark", size = "md", className }: BrandLockupProps) {
  const classes = sizeClasses[size];
  const textColor = tone === "light" ? "text-bvbp-ivory" : "text-bvbp-ink";
  const subtitleColor = tone === "light" ? "text-bvbp-ivory/55" : "text-bvbp-muted-ink";

  return (
    <span className={cn("inline-flex min-w-0 items-center", classes.gap, className)}>
      <img src={bvbpMark} alt="" aria-hidden="true" className={cn("shrink-0 rounded-[8px]", classes.mark)} />
      <span className="min-w-0 leading-[0.9]">
        <span className={cn("block whitespace-nowrap font-heading font-medium leading-none", classes.name, textColor)}>
          Basso <span className="italic text-bvbp-gold">&amp;</span> Vidal
        </span>
        <span
          className={cn(
            "font-label mt-px block whitespace-nowrap font-medium uppercase tracking-[0.18em] leading-none",
            classes.subtitle,
            subtitleColor,
          )}
        >
          Business Partners
        </span>
      </span>
    </span>
  );
}
