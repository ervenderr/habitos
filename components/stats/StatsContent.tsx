"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DisciplineChart } from "./DisciplineChart";

interface Streak {
  habitId: string;
  habitName: string;
  currentStreak: number;
  longestStreak: number;
}

interface StatsContentProps {
  streaks: Streak[];
  discipline7d: number;
  discipline30d: number;
  disciplineAll: number;
}

export function StatsContent({
  streaks,
  discipline7d,
  discipline30d,
  disciplineAll,
}: StatsContentProps) {
  const currentStreak = Math.max(...streaks.map((s) => s.currentStreak), 0);
  const longestStreak = Math.max(...streaks.map((s) => s.longestStreak), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="rounded-xl border border-gold/20 shadow-soft">
          <CardHeader>
            <CardTitle className="text-muted-foreground text-sm uppercase tracking-wider">
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold text-gold mb-2">
              {currentStreak}
            </p>
            <p className="text-sm text-muted-foreground">
              days in a row
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-purple/20 shadow-soft">
          <CardHeader>
            <CardTitle className="text-muted-foreground text-sm uppercase tracking-wider">
              Longest Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold text-purple mb-2">
              {longestStreak}
            </p>
            <p className="text-sm text-muted-foreground">
              all-time record
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Discipline Score</CardTitle>
        </CardHeader>
        <CardContent>
          <DisciplineChart
            score7d={discipline7d}
            score30d={discipline30d}
            scoreAll={disciplineAll}
          />
        </CardContent>
      </Card>

      {streaks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Habit Streaks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {streaks.map((streak) => (
                <div
                  key={streak.habitId}
                  className="flex justify-between items-center p-6 rounded-xl bg-card border border-border/50 shadow-soft"
                >
                  <div>
                    <p className="font-semibold text-lg text-foreground mb-1">{streak.habitName}</p>
                    <p className="text-sm text-muted-foreground">
                      Longest: {streak.longestStreak} days
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-gold flex items-center gap-1">
                      {streak.currentStreak}
                      <span className="text-xl">🔥</span>
                    </p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                      current
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

