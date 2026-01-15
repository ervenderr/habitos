import { HabitForm } from "@/components/habits/HabitForm";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewHabitPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-2xl pb-20 md:pb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">Create New Habit</CardTitle>
          </CardHeader>
          <CardContent>
            <HabitForm />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

