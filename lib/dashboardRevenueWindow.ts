/** Monday 00:00:00.000 in the same local timezone as `d`. */
export function startOfIsoWeekMonday(d: Date): Date {
  const dt = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dow = dt.getDay();
  const offsetFromMonday = (dow + 6) % 7;
  dt.setDate(dt.getDate() - offsetFromMonday);
  dt.setHours(0, 0, 0, 0);
  return dt;
}

export type DashboardOrderLike = {
  created_at?: string | null;
  status?: string | null;
  total_amount?: number | string | null;
};

/**
 * Sums `total_amount` for orders whose `status` passes `countsTowardRevenue`,
 * split into this calendar week (Mon–Sun, local) vs the previous full week.
 */
export function computeWeeklyRevenueSnapshot(
  orders: DashboardOrderLike[],
  countsTowardRevenue: (status: string | null | undefined) => boolean,
  now: Date = new Date(),
): { thisWeek: number; lastWeek: number } {
  const thisMonday = startOfIsoWeekMonday(now);
  const lastMonday = new Date(thisMonday);
  lastMonday.setDate(lastMonday.getDate() - 7);
  const thisMondayMs = thisMonday.getTime();
  const lastMondayMs = lastMonday.getTime();

  let thisWeek = 0;
  let lastWeek = 0;

  for (const o of orders) {
    if (!countsTowardRevenue(o.status)) continue;
    const t = new Date(o.created_at || 0).getTime();
    if (!Number.isFinite(t)) continue;
    const amt = Number(o.total_amount ?? 0);
    if (!Number.isFinite(amt)) continue;

    if (t >= thisMondayMs) thisWeek += amt;
    else if (t >= lastMondayMs && t < thisMondayMs) lastWeek += amt;
  }

  return { thisWeek, lastWeek };
}
