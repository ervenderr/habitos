"use server";

import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

/**
 * Calculate Daily Victory % for a specific date
 * Formula: sum(min(progress, target)) ÷ sum(targets) × 100
 */
export async function getDailyVictoryPercent(date?: string): Promise<number> {
  const user = await requireAuth();
  const targetDate = date || format(new Date(), "yyyy-MM-dd");

  const habits = await prisma.habit.findMany({
    where: {
      userId: user.id,
      active: true,
    },
    include: {
      logs: {
        where: {
          date: targetDate,
        },
      },
    },
  });

  if (habits.length === 0) {
    return 0;
  }

  let totalProgress = 0;
  let totalTarget = 0;

  for (const habit of habits) {
    const log = habit.logs[0];
    // For binary habits, use completed status; for count habits, use progress
    const effectiveProgress = habit.type === "binary"
      ? (log?.completed ? habit.target : 0)
      : Math.min(log?.progress || 0, habit.target);
    
    totalProgress += effectiveProgress;
    totalTarget += habit.target;
  }

  if (totalTarget === 0) {
    return 0;
  }

  return Math.round((totalProgress / totalTarget) * 100);
}

