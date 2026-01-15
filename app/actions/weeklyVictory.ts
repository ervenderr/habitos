"use server";

import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";

/**
 * Calculate Weekly Victory % for the current week
 * Formula: sum of all daily victories ÷ (7 days × sum of targets) × 100
 */
export async function getWeeklyVictoryPercent(): Promise<number> {
  const user = await requireAuth();
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 }); // Sunday
  
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const weekDates = weekDays.map(day => format(day, "yyyy-MM-dd"));

  const habits = await prisma.habit.findMany({
    where: {
      userId: user.id,
      active: true,
    },
  });

  if (habits.length === 0) {
    return 0;
  }

  let totalWeeklyProgress = 0;
  const totalTargetPerDay = habits.reduce((sum, habit) => sum + habit.target, 0);
  const totalTargetPerWeek = totalTargetPerDay * 7;

  // Get all logs for the week
  const logs = await prisma.habitLog.findMany({
    where: {
      habit: {
        userId: user.id,
        active: true,
      },
      date: {
        in: weekDates,
      },
    },
    include: {
      habit: true,
    },
  });

  // Group logs by date
  const logsByDate: Record<string, typeof logs> = {};
  logs.forEach(log => {
    if (!logsByDate[log.date]) {
      logsByDate[log.date] = [];
    }
    logsByDate[log.date].push(log);
  });

  // Calculate progress for each day
  weekDates.forEach(date => {
    const dayLogs = logsByDate[date] || [];
    let dayProgress = 0;

    habits.forEach(habit => {
      const log = dayLogs.find(l => l.habitId === habit.id);
      const effectiveProgress = habit.type === "binary"
        ? (log?.completed ? habit.target : 0)
        : Math.min(log?.progress || 0, habit.target);
      
      dayProgress += effectiveProgress;
    });

    totalWeeklyProgress += dayProgress;
  });

  if (totalTargetPerWeek === 0) {
    return 0;
  }

  return Math.round((totalWeeklyProgress / totalTargetPerWeek) * 100);
}

