export const initiativeListGridClass =
  "min-[1180px]:grid-cols-[20px_54px_minmax(150px,1.35fr)_92px_minmax(118px,0.85fr)_72px_72px_132px]";

export const activityListGridClass =
  "min-[1180px]:grid-cols-[18px_48px_minmax(170px,1fr)_76px_52px_64px_104px]";

export function formatCompactOwner(value?: string) {
  return value?.trim().split(/\s+/)[0] || "A definir";
}
