// LEVEL UP 73 - Gamification & XP System

export const XP_VALUES = {
  DSA_SESSION: 20,
  ENGLISH_PRACTICE: 10,
  WEB_DEV_SESSION: 20,
  EDITING_SESSION: 15,
  GYM_WORKOUT: 20,
  ACADEMIC_STUDY: 20,
  DSA_PROBLEM_SOLVED: 25,
  EDITING_PROJECT_COMPLETED: 100,
  WEB_PROJECT_COMPLETED: 150,
  VOCABULARY_MASTERED: 10,
  DAILY_REVIEW_COMPLETED: 30,
} as const;

export interface LevelInfo {
  level: number;
  title: string;
  minXP: number;
  maxXP: number;
  progressPercent: number;
  xpInCurrentLevel: number;
  xpToNextLevel: number;
}

const LEVEL_TITLES: { minLevel: number; title: string }[] = [
  { minLevel: 1, title: 'Aspiring Initiate' },
  { minLevel: 5, title: 'Consistent Learner' },
  { minLevel: 10, title: 'Discipline Adept' },
  { minLevel: 15, title: 'Productivity Specialist' },
  { minLevel: 20, title: 'Skill Synthesizer' },
  { minLevel: 25, title: 'Algorithmic Warrior' },
  { minLevel: 30, title: 'Master of Execution' },
  { minLevel: 40, title: 'Unstoppable Force' },
  { minLevel: 50, title: 'Apex Achiever' },
  { minLevel: 73, title: 'LEVEL UP 73 Legend' },
];

/**
 * Calculates level from total XP using a quadratic leveling curve.
 * Level 1: 0 - 99 XP
 * Level 2: 100 - 249 XP
 * Level 3: 250 - 449 XP
 * ...
 */
export function calculateLevel(totalXP: number): LevelInfo {
  let level = 1;
  let minXP = 0;
  let nextXPThreshold = 100;

  while (totalXP >= nextXPThreshold) {
    level++;
    minXP = nextXPThreshold;
    // Each level requires progressively more XP
    nextXPThreshold = minXP + (level * 75);
  }

  const xpInCurrentLevel = totalXP - minXP;
  const levelSpan = nextXPThreshold - minXP;
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / levelSpan) * 100)));
  const xpToNextLevel = nextXPThreshold - totalXP;

  // Find matching title
  let title = 'Aspiring Initiate';
  for (const t of LEVEL_TITLES) {
    if (level >= t.minLevel) {
      title = t.title;
    }
  }

  return {
    level,
    title,
    minXP,
    maxXP: nextXPThreshold,
    progressPercent,
    xpInCurrentLevel,
    xpToNextLevel,
  };
}

