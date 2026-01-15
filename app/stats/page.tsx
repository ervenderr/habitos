import { getAllStreaks } from "@/app/actions/streaks";
import { getDisciplineScore } from "@/app/actions/stats";
import { StatsContent } from "@/components/stats/StatsContent";
import { DashboardLayout } from "@/components/DashboardLayout";

export default async function StatsPage() {
  const streaks = await getAllStreaks();
  const discipline7d = await getDisciplineScore(7);
  const discipline30d = await getDisciplineScore(30);
  const disciplineAll = await getDisciplineScore(null);

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6 md:py-12 max-w-4xl pb-20 md:pb-12">
        <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-12 text-foreground">Statistics</h1>
        <StatsContent
          streaks={streaks}
          discipline7d={discipline7d}
          discipline30d={discipline30d}
          disciplineAll={disciplineAll}
        />
      </div>
    </DashboardLayout>
  );
}

