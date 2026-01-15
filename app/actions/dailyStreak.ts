"use server";

import { requireAuth } from "@/lib/auth-utils";
import { getDailyVictoryForDate } from "@/app/actions/habitLogs";
import { subDays, format } from "date-fns";

/**
 * Calculate global daily victory streak
 * A day counts if Daily Victory % >= 60%
 */
export async function getDailyVictoryStreak(): Promise<number> {
  const user = await requireAuth();

  const today = format(new Date(), "yyyy-MM-dd");
  const todayVictory = await getDailyVictoryForDate(today);

  // If today is not >= 60%, streak is 0
  if (todayVictory < 60) {
    return 0;
  }

  // Check consecutive days backwards
  let streak = 1;
  let currentDate = subDays(new Date(), 1);

  while (true) {
    const dateStr = format(currentDate, "yyyy-MM-dd");
    const dailyVictory = await getDailyVictoryForDate(dateStr);

    if (dailyVictory >= 60) {
      streak++;
      currentDate = subDays(currentDate, 1);
    } else {
      break;
    }
  }

  return streak;
}

