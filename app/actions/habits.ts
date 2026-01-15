"use server";

import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getHabits() {
  const user = await requireAuth();

  return prisma.habit.findMany({
    where: {
      userId: user.id,
      active: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function createHabit(formData: FormData) {
  const user = await requireAuth();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string | null;
  const frequency = formData.get("frequency") as string || "daily";
  const type = (formData.get("type") as string) || "binary";
  const target = formData.get("target") ? parseInt(formData.get("target") as string) : 1;

  if (!name) {
    throw new Error("Name is required");
  }

  if (type === "count" && target < 1) {
    throw new Error("Target must be at least 1 for count habits");
  }

  const habit = await prisma.habit.create({
    data: {
      userId: user.id,
      name,
      description: description || null,
      type,
      target: type === "binary" ? 1 : target,
      frequency,
      active: true,
    },
  });

  revalidatePath("/habits");
  revalidatePath("/dashboard");
  return habit;
}

export async function updateHabit(formData: FormData) {
  const user = await requireAuth();

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string | null;
  const frequency = formData.get("frequency") as string || "daily";
  const type = (formData.get("type") as string) || "binary";
  const target = formData.get("target") ? parseInt(formData.get("target") as string) : 1;

  if (!id || !name) {
    throw new Error("ID and name are required");
  }

  // Verify ownership
  const existingHabit = await prisma.habit.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!existingHabit) {
    throw new Error("Habit not found");
  }

  if (type === "count" && target < 1) {
    throw new Error("Target must be at least 1 for count habits");
  }

  const habit = await prisma.habit.update({
    where: { id },
    data: {
      name,
      description: description || null,
      type,
      target: type === "binary" ? 1 : target,
      frequency,
    },
  });

  revalidatePath("/habits");
  revalidatePath("/dashboard");
  return habit;
}

export async function deleteHabit(id: string) {
  const user = await requireAuth();

  // Verify ownership
  const existingHabit = await prisma.habit.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!existingHabit) {
    throw new Error("Habit not found");
  }

  // Soft delete
  await prisma.habit.update({
    where: { id },
    data: {
      active: false,
    },
  });

  revalidatePath("/habits");
  revalidatePath("/dashboard");
}

