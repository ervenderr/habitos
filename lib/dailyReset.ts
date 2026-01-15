import { prisma } from "./prisma";
import { format } from "date-fns";

export async function runDailyReset(userId: string) {
  const today = format(new Date(), "yyyy-MM-dd");

  // Get user's active habits
  const habits = await prisma.habit.findMany({
    where: {
      userId,
      active: true,
    },
  });

  // Create habit logs for today if they don't exist
  for (const habit of habits) {
    await prisma.habitLog.upsert({
      where: {
        habitId_date: {
          habitId: habit.id,
          date: today,
        },
      },
      update: {}, // Don't change existing logs
      create: {
        habitId: habit.id,
        date: today,
        completed: false,
      },
    });
  }

  // Streaks are calculated on-demand, so no need to update them here
  return { success: true, habitsProcessed: habits.length };
}

