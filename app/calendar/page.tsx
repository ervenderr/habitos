import { getHabitLogsByDateRange, getDailyVictoryForDate } from "@/app/actions/habitLogs";
import { Heatmap } from "@/components/calendar/Heatmap";
import { DashboardLayout } from "@/components/DashboardLayout";
import { subDays, format } from "date-fns";

export default async function CalendarPage() {
  const endDate = format(new Date(), "yyyy-MM-dd");
  const startDate = format(subDays(new Date(), 365), "yyyy-MM-dd");
  
  const logsByDate = await getHabitLogsByDateRange(startDate, endDate);

  // Calculate daily victory % for each date
  const dailyVictoryByDate: Record<string, number> = {};
  const days = Array.from({ length: 365 }, (_, i) => {
    const date = subDays(new Date(), 365 - i - 1);
    return format(date, "yyyy-MM-dd");
  });

  // Calculate daily victory for all days in parallel
  const victoryPromises = days.map(async (date) => {
    const victory = await getDailyVictoryForDate(date);
    return { date, victory };
  });

  const victories = await Promise.all(victoryPromises);
  victories.forEach(({ date, victory }) => {
    dailyVictoryByDate[date] = victory;
  });

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6 md:py-12 max-w-6xl pb-20 md:pb-12">
        <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-12 text-foreground">Calendar</h1>
        <Heatmap logsByDate={logsByDate} dailyVictoryByDate={dailyVictoryByDate} />
      </div>
    </DashboardLayout>
  );
}

