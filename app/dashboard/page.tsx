import { getHabits } from "@/app/actions/habits";
import { getTodayHabitLogs } from "@/app/actions/habitLogs";
import { getWeeklyVictoryPercent } from "@/app/actions/weeklyVictory";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { DashboardLayout } from "@/components/DashboardLayout";
import { format } from "date-fns";

export default async function DashboardPage() {
  const habits = await getHabits();
  const todayLogs = await getTodayHabitLogs();
  const weeklyVictory = await getWeeklyVictoryPercent();
  const today = format(new Date(), "EEEE, MMMM d, yyyy");

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6 md:py-12 max-w-4xl pb-20 md:pb-12">
        <div className="mb-6 md:mb-12 space-y-1 md:space-y-2">
          <h1 className="text-2xl md:text-4xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm md:text-lg">{today}</p>
        </div>
        <DashboardContent habits={habits} todayLogs={todayLogs} weeklyVictory={weeklyVictory} />
      </div>
    </DashboardLayout>
  );
}

