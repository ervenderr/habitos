"use server";

import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { subDays, format, isBefore, isSameDay, parseISO } from "date-fns";

export async function calculateStreak(habitId: string): Promise<number> {
  const user = await requireAuth();

  // Verify habit ownership
  const habit = await prisma.habit.findFirst({
    where: {
      id: habitId,
      userId: user.id,
    },
  });

  if (!habit) {
    return 0;
  }

  const today = format(new Date(), "yyyy-MM-dd");
  const todayLog = await prisma.habitLog.findUnique({
    where: {
      habitId_date: {
        habitId,
        date: today,
      },
    },
  });

  // If today is not completed, streak is 0
  if (!todayLog || !todayLog.completed) {
    return 0;
  }

  // Check consecutive days backwards
  let streak = 1;
  let currentDate = subDays(new Date(), 1);

  while (true) {
    const dateStr = format(currentDate, "yyyy-MM-dd");
    const log = await prisma.habitLog.findUnique({
      where: {
        habitId_date: {
          habitId,
          date: dateStr,
        },
      },
    });

    if (log && log.completed) {
      streak++;
      currentDate = subDays(currentDate, 1);
    } else {
      break;
    }
  }

  return streak;
}

export async function getLongestStreak(habitId: string): Promise<number> {
  const user = await requireAuth();

  // Verify habit ownership
  const habit = await prisma.habit.findFirst({
    where: {
      id: habitId,
      userId: user.id,
    },
  });

  if (!habit) {
    return 0;
  }

  const logs = await prisma.habitLog.findMany({
    where: {
      habitId,
      completed: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  if (logs.length === 0) {
    return 0;
  }

  // Calculate longest streak from logs
  let longestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < logs.length; i++) {
    const prevDate = parseISO(logs[i - 1].date);
    const currDate = parseISO(logs[i].date);
    const daysDiff = Math.floor(
      (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return longestStreak;
}

export async function getAllStreaks() {
  const user = await requireAuth();

  const habits = await prisma.habit.findMany({
    where: {
      userId: user.id,
      active: true,
    },
  });

  const streaks = await Promise.all(
    habits.map(async (habit) => ({
      habitId: habit.id,
      habitName: habit.name,
      currentStreak: await calculateStreak(habit.id),
      longestStreak: await getLongestStreak(habit.id),
    }))
  );

  return streaks;
}

