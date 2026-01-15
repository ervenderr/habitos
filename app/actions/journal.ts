"use server";

import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getDailyNote(date: string) {
  const user = await requireAuth();

  return prisma.dailyNote.findUnique({
    where: {
      userId_date: {
        userId: user.id,
        date,
      },
    },
  });
}

export async function saveDailyNote(
  date: string,
  mood: number | null,
  notes: string | null
) {
  const user = await requireAuth();

  await prisma.dailyNote.upsert({
    where: {
      userId_date: {
        userId: user.id,
        date,
      },
    },
    update: {
      mood: mood || null,
      notes: notes || null,
    },
    create: {
      userId: user.id,
      date,
      mood: mood || null,
      notes: notes || null,
    },
  });

  revalidatePath("/journal");
}

