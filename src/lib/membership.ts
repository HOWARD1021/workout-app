const STORAGE_KEY = "workout-membership";

export interface MembershipData {
  cost: number;
  period: "monthly" | "yearly";
  startDate: string;
}

export function loadMembership(): MembershipData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveMembership(data: MembershipData | null) {
  try {
    if (data) localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

export function calculateMembershipStats(
  membership: MembershipData,
  workoutCount: number
) {
  const startDateObj = new Date(membership.startDate);
  const today = new Date();
  const daysSinceStart = Math.max(
    1,
    Math.floor(
      (today.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24)
    )
  );

  const totalCostSoFar =
    membership.period === "monthly"
      ? membership.cost * Math.ceil(daysSinceStart / 30)
      : membership.cost * Math.ceil(daysSinceStart / 365);

  const costPerVisit =
    workoutCount > 0 ? Math.round(totalCostSoFar / workoutCount) : 0;

  const costPerDay =
    daysSinceStart > 0 ? Math.round(totalCostSoFar / daysSinceStart) : 0;

  const nextVisitCost =
    workoutCount > 0
      ? Math.round(totalCostSoFar / (workoutCount + 1))
      : 0;

  return {
    daysSinceStart,
    totalCostSoFar,
    costPerVisit,
    costPerDay,
    nextVisitCost,
  };
}
