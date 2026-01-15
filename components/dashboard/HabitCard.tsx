"use client";

import { Habit } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { logHabit } from "@/app/actions/habitLogs";
import { format } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface HabitCardProps {
  habit: Habit;
  completed: boolean;
  progress: number;
  streak?: number;
  onToggle: (completed: boolean) => void;
  onProgressUpdate: (progress: number, completed: boolean) => void;
}

export function HabitCard({ habit, completed, progress, streak, onToggle, onProgressUpdate }: HabitCardProps) {
  const [loading, setLoading] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);

  const isCountHabit = habit.type === "count";
  const currentProgress = isCountHabit ? progress : (completed ? 1 : 0);
  const target = habit.target;

  const handleBinaryToggle = async (checked: boolean) => {
    setLoading(true);
    try {
      const today = format(new Date(), "yyyy-MM-dd");
      await logHabit(habit.id, today, checked);
      onToggle(checked);
      
      if (checked) {
        setJustCompleted(true);
        setTimeout(() => setJustCompleted(false), 600);
      }
    } catch (error) {
      console.error("Error logging habit:", error);
      onToggle(!checked);
    } finally {
      setLoading(false);
    }
  };

  const handleCountUpdate = async (newProgress: number) => {
    setLoading(true);
    try {
      const today = format(new Date(), "yyyy-MM-dd");
      // Allow progress to go up to target, but don't cap it (user might want to track beyond target)
      const cappedProgress = Math.max(0, Math.min(newProgress, target));
      const isCompleted = cappedProgress >= target;
      
      await logHabit(habit.id, today, isCompleted, cappedProgress);
      onProgressUpdate(cappedProgress, isCompleted);
      
      if (isCompleted && !completed) {
        setJustCompleted(true);
        setTimeout(() => setJustCompleted(false), 600);
      }
    } catch (error) {
      console.error("Error logging habit:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleIncrement = () => {
    if (currentProgress < target) {
      handleCountUpdate(currentProgress + 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    if (currentProgress > 0) {
      handleCountUpdate(currentProgress - 1);
    }
  };

  const progressPercent = target > 0 ? (currentProgress / target) * 100 : 0;
  const hasStreak = streak !== undefined && streak > 0;
  const isMissed = !completed && hasStreak;

  return (
    <Card 
      className={cn(
        "transition-all duration-300 rounded-xl border border-border/50 shadow-lg",
        completed && "border-gold/50 shadow-glow-gold",
        isMissed && "border-pink/30",
        justCompleted && "animate-pulse",
        isCountHabit && !loading && currentProgress < target && "cursor-pointer active:scale-[0.98]"
      )}
      onClick={isCountHabit && !loading && currentProgress < target ? handleIncrement : undefined}
    >
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col gap-4">
          {/* Header: Name, Description, Streak */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base md:text-xl text-foreground mb-0.5 md:mb-1">
                {habit.name}
              </h3>
              {habit.description && (
                <p className="text-xs md:text-sm text-muted-foreground line-clamp-1">
                  {habit.description}
                </p>
              )}
            </div>
            
            {hasStreak && (
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-muted-foreground mb-0.5 md:mb-1 uppercase tracking-wider hidden sm:block">
                  Streak
                </p>
                <p className="text-xl md:text-2xl font-bold text-gold flex items-center gap-1">
                  {streak}
                  <span className="text-lg md:text-xl">🔥</span>
                </p>
              </div>
            )}
          </div>

          {/* Binary Habit UI */}
          {!isCountHabit && (
            <div className="flex items-center gap-3 md:gap-6">
              <button
                onClick={() => !loading && handleBinaryToggle(!completed)}
                disabled={loading}
                className={cn(
                  "flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-lg border-2 transition-all duration-200 flex items-center justify-center min-h-[44px] min-w-[44px]",
                  completed
                    ? "bg-gold border-gold shadow-glow-gold"
                    : "bg-card border-muted hover:border-purple/50 active:border-purple",
                  loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer active:scale-95"
                )}
              >
                {completed && (
                  <svg className="w-6 h-6 md:w-7 md:h-7 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <div className="flex-1" />
            </div>
          )}

          {/* Count Habit UI */}
          {isCountHabit && (
            <div className="space-y-3">
              {/* Progress Display with Decrement Button */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl md:text-3xl font-bold text-foreground">
                      {currentProgress}
                    </span>
                    <span className="text-muted-foreground">/</span>
                    <span className="text-xl md:text-2xl font-semibold text-muted-foreground">
                      {target}
                    </span>
                  </div>
                  {/* Mini Progress Bar */}
                  <div className="w-full bg-secondary rounded-full h-2 md:h-3 overflow-hidden border border-border/30">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-300 ease-out",
                        completed ? "bg-gold shadow-glow-gold" : "bg-purple"
                      )}
                      style={{ width: `${Math.min(progressPercent, 100)}%` }}
                    />
                  </div>
                </div>
                
                {/* Decrement Button */}
                {currentProgress > 0 && (
                  <button
                    onClick={handleDecrement}
                    disabled={loading}
                    className={cn(
                      "flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-lg border-2 transition-all duration-200 flex items-center justify-center min-h-[44px] min-w-[44px]",
                      "bg-pink/20 text-pink border-pink/30",
                      "hover:bg-pink/30 active:scale-95",
                      loading && "opacity-50 cursor-not-allowed"
                    )}
                    title="Remove 1 (for mistakes)"
                  >
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Tap Hint */}
              {currentProgress < target && (
                <p className="text-xs text-center text-muted-foreground">
                  Tap card to add 1 • Tap − to remove 1
                </p>
              )}
              {currentProgress >= target && (
                <p className="text-xs text-center text-gold">
                  ✓ Completed! Tap − to adjust if needed
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
