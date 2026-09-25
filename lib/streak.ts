export function isStreakActive(lastActiveDate: string | null): boolean {
  if (!lastActiveDate) return false;
  const last = new Date(lastActiveDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  last.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays <= 1;
}

export function getStreakBonusXP(streakCount: number): number {
  return Math.min(streakCount * 10, 100);
}
