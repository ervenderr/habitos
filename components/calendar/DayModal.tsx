"use client";

import { format, parseISO, isSameDay } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HabitLog } from "@prisma/client";
import { cn } from "@/lib/utils";

interface HabitInfo {
  id: string;
  name: string;
  type: string;
  target: number;
}

interface DayModalProps {
  date: string;
  logs: Array<HabitLog & { habit: HabitInfo }> | null;
  dailyVictory: number;
  onClose: () => void;
}

export function DayModal({ date, logs, dailyVictory, onClose }: DayModalProps) {
  const parsedDate = parseISO(date);
  const formattedDate = format(parsedDate, "EEEE, MMMM d, yyyy");
  const isToday = isSameDay(parsedDate, new Date());
  const isPast = parsedDate < new Date();

  const getVictoryColor = (percent: number) => {
    if (percent >= 90) return "text-gold";
    if (percent >= 60) return "text-purple";
    if (percent > 0) return "text-pink";
    return "text-muted-foreground";
  };

  const getVictoryLabel = (percent: number) => {
    if (percent >= 90) return "Perfect Day!";
    if (percent >= 60) return "Great Progress!";
    if (percent > 0) return "Partial Completion";
    return "No Progress";
  };

  const getVictoryBg = (percent: number) => {
    if (percent >= 90) return "bg-gold/20 border-gold/50";
    if (percent >= 60) return "bg-purple/20 border-purple/50";
    if (percent > 0) return "bg-pink/20 border-pink/50";
    return "bg-secondary border-border/30";
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <Card 
        className="max-w-md w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border-2 border-border/50 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="pb-4 border-b border-border/30">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <CardTitle className="text-xl md:text-2xl font-bold text-foreground mb-1">
                {formattedDate}
              </CardTitle>
              {isToday && (
                <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-purple/20 text-purple border border-purple/50">
                  Today
                </span>
              )}
              {isPast && !isToday && (
                <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-muted text-muted-foreground">
                  Past
                </span>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="rounded-full hover:bg-secondary/50 shrink-0 text-xl font-light leading-none"
            >
              ×
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6 pb-6 overflow-y-auto flex-1">
          {/* Daily Victory Badge */}
          <div className={cn(
            "mb-6 p-4 rounded-xl border-2 text-center",
            getVictoryBg(dailyVictory)
          )}>
            <p className="text-xs md:text-sm font-medium text-muted-foreground mb-1">
              Daily Victory
            </p>
            <p className={cn("text-3xl md:text-4xl font-bold mb-1", getVictoryColor(dailyVictory))}>
              {dailyVictory}%
            </p>
            <p className={cn("text-sm md:text-base font-semibold", getVictoryColor(dailyVictory))}>
              {getVictoryLabel(dailyVictory)}
            </p>
          </div>

          {/* Habits List */}
          {logs && logs.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-sm md:text-base font-semibold text-foreground mb-3">
                Habits Completed ({logs.length})
              </h3>
              <div className="space-y-2">
                {logs.map((log) => {
                  const isCount = log.habit.type === "count";
                  const progress = log.progress || 0;
                  const target = log.habit.target || 1;
                  const isComplete = log.completed;

                  return (
                    <div
                      key={log.id}
                      className={cn(
                        "flex items-center justify-between gap-3 p-3 rounded-lg border transition-all",
                        isComplete
                          ? "bg-gold/10 border-gold/30 shadow-sm"
                          : "bg-secondary/30 border-border/30"
                      )}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                          isComplete ? "bg-gold/20 border border-gold/50" : "bg-secondary border border-border"
                        )}>
                          {isComplete && (
                            <span className="text-gold text-sm font-bold">✓</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm md:text-base truncate">
                            {log.habit.name}
                          </p>
                          {isCount && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {progress} / {target}
                            </p>
                          )}
                        </div>
                      </div>
                      {isComplete && (
                        <span className="text-xs font-semibold text-gold shrink-0">
                          Done
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/50 flex items-center justify-center">
                <span className="text-2xl text-muted-foreground">📅</span>
              </div>
              <p className="text-muted-foreground text-sm md:text-base font-medium mb-1">
                No habits completed
              </p>
              <p className="text-muted-foreground/70 text-xs md:text-sm">
                {isToday ? "Start tracking your habits today!" : "No activity recorded for this day."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

