export const PLAN_LIMITS = {
  starter: { staff: 1, quotes: false },
  growth: { staff: 5, quotes: true },
  scale: { staff: Infinity, quotes: true },
} as const;

export type PlanType = keyof typeof PLAN_LIMITS; 