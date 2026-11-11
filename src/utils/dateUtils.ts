// LEVEL UP 73 - Date & Challenge Utilities
import { differenceInDays, format, isAfter, isBefore, parseISO, startOfDay } from 'date-fns';

export const CHALLENGE_START_DATE = '2026-11-11';
export const CHALLENGE_DEADLINE = '2027-01-23';

/**
 * Returns formatted challenge countdown stats based on current date
 */
export function getChallengeStats(currentDateStr?: string) {
  const today = currentDateStr ? startOfDay(parseISO(currentDateStr)) : startOfDay(new Date());
  const startDate = startOfDay(parseISO(CHALLENGE_START_DATE));
  const endDate = startOfDay(parseISO(CHALLENGE_DEADLINE));

  const totalDays = differenceInDays(endDate, startDate) + 1; // 74 days (Nov 11 to Jan 23 inclusive = 73 full span days)
  
  let daysCompleted = differenceInDays(today, startDate);
  if (daysCompleted < 0) daysCompleted = 0;
  if (daysCompleted > totalDays) daysCompleted = totalDays;

  let remainingDays = differenceInDays(endDate, today);
  if (remainingDays < 0) remainingDays = 0;

  const completionPercentage = Math.min(100, Math.max(0, Math.round((daysCompleted / totalDays) * 100)));

  return {
    startDate: CHALLENGE_START_DATE,
    deadline: CHALLENGE_DEADLINE,
    totalDays,
    daysCompleted,
    remainingDays,
    completionPercentage,
    isStarted: !isBefore(today, startDate),
    isFinished: isAfter(today, endDate),
    todayFormatted: format(today, 'EEEE, d MMMM yyyy'),
    todayDateISO: format(today, 'yyyy-MM-dd')
  };
}

export function formatDate(dateStr: string, formatPattern = 'MMM dd, yyyy'): string {
  try {
    return format(parseISO(dateStr), formatPattern);
  } catch {
    return dateStr;
  }
}

export function getDaysUntil(targetDateStr: string): number {
  try {
    const today = startOfDay(new Date());
    const target = startOfDay(parseISO(targetDateStr));
    return differenceInDays(target, today);
  } catch {
    return 0;
  }
}

