"use client";

import { useState, useEffect } from "react";
import { Habit } from "@prisma/client";
import { HabitCard } from "./HabitCard";
import { deleteHabit } from "@/app/actions/habits";
import { useRouter } from "next/navigation";

interface HabitListProps {
  initialHabits: Habit[];
}

export function HabitList({ initialHabits }: HabitListProps) {
  const [habits, setHabits] = useState(initialHabits);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this habit?")) {
      await deleteHabit(id);
      setHabits(habits.filter((h) => h.id !== id));
      router.refresh();
    }
  };

  if (habits.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-muted-foreground text-lg mb-2">
          No habits yet.
        </p>
        <p className="text-muted-foreground/70">
          Create your first habit to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {habits.map((habit) => (
        <HabitCard key={habit.id} habit={habit} onDelete={handleDelete} />
      ))}
    </div>
  );
}

