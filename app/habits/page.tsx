import { getHabits } from "@/app/actions/habits";
import { HabitList } from "@/components/habits/HabitList";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function HabitsPage() {
  const habits = await getHabits();

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6 md:py-12 max-w-4xl pb-20 md:pb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-12">
          <h1 className="text-2xl md:text-4xl font-bold text-foreground">My Habits</h1>
          <Link href="/habits/new">
            <Button className="w-full sm:w-auto">Add Habit</Button>
          </Link>
        </div>
        <HabitList initialHabits={habits} />
      </div>
    </DashboardLayout>
  );
}

