"use client";

import { Habit } from "@prisma/client";
import { HabitCard } from "./HabitCard";
import { ProgressBar } from "./ProgressBar";
import { WeeklyVictoryBar } from "./WeeklyVictoryBar";
import { useState, useEffect } from "react";
import { calculateStreak } from "@/app/actions/streaks";

interface TodayLog {
  habitId: string;
  completed: boolean;
  progress: number;
}

interface DashboardContentProps {
  habits: Habit[];
  todayLogs: TodayLog[];
  weeklyVictory: number;
}

export function DashboardContent({ habits, todayLogs, weeklyVictory: initialWeeklyVictory }: DashboardContentProps) {
  const [logs, setLogs] = useState(todayLogs);
  const [streaks, setStreaks] = useState<Record<string, number>>({});
  const [loadingStreaks, setLoadingStreaks] = useState(true);
  const [weeklyVictory, setWeeklyVictory] = useState(initialWeeklyVictory);

  useEffect(() => {
    const loadStreaks = async () => {
      const streakMap: Record<string, number> = {};
      for (const habit of habits) {
        try {
          const streak = await calculateStreak(habit.id);
          streakMap[habit.id] = streak;
        } catch (error) {
          streakMap[habit.id] = 0;
        }
      }
      setStreaks(streakMap);
      setLoadingStreaks(false);
    };

    loadStreaks();
  }, [habits]);

  const completedCount = logs.filter((log) => log.completed).length;
  const totalCount = habits.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleToggle = (habitId: string, completed: boolean) => {
    // Update logs immediately for instant UI feedback
    setLogs((prev) =>
      prev.map((log) =>
        log.habitId === habitId ? { ...log, completed } : log
      )
    );
  };

  const handleProgressUpdate = (habitId: string, progress: number, completed: boolean) => {
    // Update logs immediately for instant UI feedback
    setLogs((prev) =>
      prev.map((log) =>
        log.habitId === habitId ? { ...log, progress, completed } : log
      )
    );
  };

  // Refresh weekly victory when logs change
  useEffect(() => {
    const refreshWeeklyVictory = async () => {
      try {
        const response = await fetch('/api/weekly-victory', { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          setWeeklyVictory(data.percent);
        }
      } catch (error) {
        console.error('Failed to refresh weekly victory:', error);
      }
    };

    // Debounce the refresh
    const timeoutId = setTimeout(refreshWeeklyVictory, 300);
    return () => clearTimeout(timeoutId);
  }, [logs]);

  if (habits.length === 0) {
    return (
      <div className="text-center py-12 md:py-24">
        <p className="text-muted-foreground text-base md:text-lg mb-2">
          No habits yet.
        </p>
        <p className="text-muted-foreground/70 text-sm md:text-base">
          Create your first habit to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <WeeklyVictoryBar percent={weeklyVictory} />
      <ProgressBar progress={progress} completed={completedCount} total={totalCount} />
      
      <div className="space-y-3 md:space-y-4">
        {habits.map((habit) => {
          const log = logs.find((l) => l.habitId === habit.id);
          const streak = streaks[habit.id] || 0;
          
          return (
            <HabitCard
              key={habit.id}
              habit={habit}
              completed={log?.completed || false}
              progress={log?.progress || 0}
              streak={loadingStreaks ? undefined : streak}
              onToggle={(completed) => handleToggle(habit.id, completed)}
              onProgressUpdate={(progress, completed) => handleProgressUpdate(habit.id, progress, completed)}
            />
          );
        })}
      </div>
    </div>
  );
}

