"use server";

import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { format } from "date-fns";

export async function logHabit(habitId: string, date: string, completed: boolean, progress?: number) {
  const user = await requireAuth();

  // Verify habit ownership
  const habit = await prisma.habit.findFirst({
    where: {
      id: habitId,
      userId: user.id,
    },
  });

  if (!habit) {
    throw new Error("Habit not found");
  }

  // For count habits, use provided progress; for binary, use 1 if completed, 0 if not
  let finalProgress = progress !== undefined ? progress : (completed ? 1 : 0);
  
  // Ensure progress doesn't exceed target
  if (finalProgress > habit.target) {
    finalProgress = habit.target;
  }
  
  // Calculate completed: progress >= target
  const isCompleted = finalProgress >= habit.target;

  // Upsert habit log
  await prisma.habitLog.upsert({
    where: {
      habitId_date: {
        habitId,
        date,
      },
    },
    update: {
      progress: finalProgress,
      completed: isCompleted,
    },
    create: {
      habitId,
      date,
      progress: finalProgress,
      completed: isCompleted,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/calendar");
  revalidatePath("/stats");
}

export async function getHabitLogs(habitId: string) {
  const user = await requireAuth();

  // Verify habit ownership
  const habit = await prisma.habit.findFirst({
    where: {
      id: habitId,
      userId: user.id,
    },
  });

  if (!habit) {
    throw new Error("Habit not found");
  }

  return prisma.habitLog.findMany({
    where: {
      habitId,
    },
    orderBy: {
      date: "desc",
    },
  });
}

export async function getTodayHabitLogs() {
  const user = await requireAuth();

  const today = format(new Date(), "yyyy-MM-dd");

  const habits = await prisma.habit.findMany({
    where: {
      userId: user.id,
      active: true,
    },
    include: {
      logs: {
        where: {
          date: today,
        },
      },
    },
  });

  return habits.map((habit) => ({
    habitId: habit.id,
    completed: habit.logs[0]?.completed || false,
    progress: habit.logs[0]?.progress || 0,
  }));
}

export async function getHabitLogsByDateRange(startDate: string, endDate: string) {
  const user = await requireAuth();

  // Get all logs (not just completed) to calculate daily victory %
  const logs = await prisma.habitLog.findMany({
    where: {
      habit: {
        userId: user.id,
        active: true,
      },
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      habit: {
        select: {
          id: true,
          name: true,
          type: true,
          target: true,
        },
      } as any,
    },
    orderBy: {
      date: "asc",
    },
  });

  // Group by date
  const grouped: Record<string, typeof logs> = {};
  logs.forEach((log) => {
    if (!grouped[log.date]) {
      grouped[log.date] = [];
    }
    grouped[log.date].push(log);
  });

  return grouped;
}

/**
 * Get daily victory % for a specific date
 */
export async function getDailyVictoryForDate(date: string): Promise<number> {
  const user = await requireAuth();

  const habits = await prisma.habit.findMany({
    where: {
      userId: user.id,
      active: true,
    },
    include: {
      logs: {
        where: {
          date,
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
    const progress = log?.progress || 0;
    const effectiveProgress = Math.min(progress, habit.target);
    
    totalProgress += effectiveProgress;
    totalTarget += habit.target;
  }

  if (totalTarget === 0) {
    return 0;
  }

  return Math.round((totalProgress / totalTarget) * 100);
}
