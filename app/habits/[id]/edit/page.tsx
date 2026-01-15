import { getHabits } from "@/app/actions/habits";
import { HabitForm } from "@/components/habits/HabitForm";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";

export default async function EditHabitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const habits = await getHabits();
  const habit = habits.find((h) => h.id === id);

  if (!habit) {
    notFound();
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-2xl pb-20 md:pb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">Edit Habit</CardTitle>
          </CardHeader>
          <CardContent>
            <HabitForm habit={habit} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

