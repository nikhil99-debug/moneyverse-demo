// XP values for different actions
export const XP_VALUES = {
  FLASHCARD_SECTION: 20,
  COMIC_PANEL: 10,
  INTERACTIVE_EXERCISE: 30,
  QUIZ_PASS: 100,       // 60%+
  QUIZ_PERFECT: 200,    // 100%
  DAILY_LOGIN: 25,
  STREAK_BONUS_PER_DAY: 10, // caps at 100
  STREAK_BONUS_CAP: 100,
  CHARACTER_ARC_COMPLETE: 500,
  ALL_ARCS_COMPLETE: 2000,
  REFERRAL: 300,
  BEAT_FRIEND_SCORE: 50,
} as const;

// Level thresholds
export const LEVELS = [
  { level: 1, xpRequired: 0, title: 'Financial Noob' },
  { level: 2, xpRequired: 200, title: 'Money Curious' },
  { level: 3, xpRequired: 500, title: 'Rupee Rookie' },
  { level: 4, xpRequired: 1000, title: 'Market Watcher' },
  { level: 5, xpRequired: 2000, title: 'Bull Runner' },
  { level: 6, xpRequired: 3500, title: 'Portfolio Builder' },
  { level: 7, xpRequired: 5500, title: 'Wealth Apprentice' },
  { level: 8, xpRequired: 8000, title: 'Smart Money' },
  { level: 9, xpRequired: 12000, title: 'Financial Sensei' },
  { level: 10, xpRequired: 18000, title: 'MoneyMania Legend' },
] as const;

export function getLevelForXP(xp: number) {
  let currentLevel: (typeof LEVELS)[number] = LEVELS[0];
  for (const level of LEVELS) {
    if (xp >= level.xpRequired) {
      currentLevel = level;
    } else {
      break;
    }
  }
  return currentLevel;
}

export function getXPProgress(xp: number) {
  const current = getLevelForXP(xp);
  const nextLevel = LEVELS.find((l) => l.level === current.level + 1);
  if (!nextLevel) {
    return { current, next: null, progress: 100, xpToNext: 0 };
  }
  const xpInLevel = xp - current.xpRequired;
  const xpNeeded = nextLevel.xpRequired - current.xpRequired;
  const progress = Math.round((xpInLevel / xpNeeded) * 100);
  return { current, next: nextLevel, progress, xpToNext: xpNeeded - xpInLevel };
}

export function calculateQuizXP(score: number, totalQuestions: number): number {
  const percentage = (score / totalQuestions) * 100;
  if (percentage === 100) return XP_VALUES.QUIZ_PERFECT;
  if (percentage >= 60) return XP_VALUES.QUIZ_PASS;
  return 0;
}
