"use server";

import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { subDays, format } from "date-fns";

export async function getDisciplineScore(days: number | null): Promise<number> {
  const user = await requireAuth();

  const startDate = days
    ? format(subDays(new Date(), days), "yyyy-MM-dd")
    : null;

  // Get all active habits
  const habits = await prisma.habit.findMany({
    where: {
      userId: user.id,
      active: true,
    },
  });

  if (habits.length === 0) {
    return 0;
  }

  // Get completed logs in the period
  const whereClause: any = {
    habit: {
      userId: user.id,
      active: true,
    },
    completed: true,
  };

  if (startDate) {
    whereClause.date = {
      gte: startDate,
    };
  }

  const completedLogs = await prisma.habitLog.count({
    where: whereClause,
  });

  // Calculate possible completions
  const endDate = format(new Date(), "yyyy-MM-dd");
  let totalDays = days;
  
  if (!totalDays) {
    const firstHabit = await prisma.habit.findFirst({
      where: { userId: user.id, active: true },
      orderBy: { createdAt: "asc" },
    });
    
    if (firstHabit) {
      totalDays = Math.ceil(
        (new Date().getTime() - firstHabit.createdAt.getTime()) /
          (1000 * 60 * 60 * 24)
      );
    } else {
      totalDays = 1; // Default to 1 day if no habits exist
    }
  }

  const possibleCompletions = habits.length * (days || totalDays);
  
  if (possibleCompletions === 0) {
    return 0;
  }

  return Math.round((completedLogs / possibleCompletions) * 100);
}

