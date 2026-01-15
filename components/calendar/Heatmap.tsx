"use client";

import { useState, useRef, useEffect } from "react";
import { format, subDays, parseISO, isSameDay, startOfWeek, getMonth, getYear } from "date-fns";
import { DayModal } from "./DayModal";
import { HabitLog } from "@prisma/client";
import { Card } from "@/components/ui/card";

interface HabitInfo {
  id: string;
  name: string;
  type: string;
  target: number;
}

interface HeatmapProps {
  logsByDate: Record<string, Array<HabitLog & { habit: HabitInfo }>>;
  dailyVictoryByDate: Record<string, number>;
}

export function Heatmap({ logsByDate, dailyVictoryByDate }: HeatmapProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedLogs, setSelectedLogs] = useState<typeof logsByDate[string] | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Generate last 365 days
  const days = Array.from({ length: 365 }, (_, i) => {
    const date = subDays(new Date(), 365 - i - 1);
    return format(date, "yyyy-MM-dd");
  });

  // Scroll to end (most recent) on mount
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, []);

  const handleDayClick = (date: string) => {
    setSelectedDate(date);
    setSelectedLogs(logsByDate[date] || null);
  };

  const getColor = (date: string): string => {
    const dailyVictory = dailyVictoryByDate[date] || 0;
    const today = format(new Date(), "yyyy-MM-dd");
    const isPast = date < today;
    const hasLogs = logsByDate[date] && logsByDate[date].length > 0;

    // 0% and past = missed day (pink)
    if (dailyVictory === 0 && isPast && !hasLogs) {
      return "bg-pink/40 border border-pink/60";
    }

    // 90-100% = perfect day (gold)
    if (dailyVictory >= 90) {
      return "bg-gold/70 border border-gold shadow-glow-gold";
    }

    // 60-89% = great progress (purple)
    if (dailyVictory >= 60) {
      return "bg-purple/50 border border-purple/70";
    }

    // 1-59% = partial (pink)
    if (dailyVictory > 0) {
      return "bg-pink/30 border border-pink/50";
    }

    // 0% = no data (dark gray)
    return "bg-secondary border border-border/30";
  };

  // Group days by weeks
  const weeks: string[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  // Get month labels for weeks
  const getMonthLabel = (weekDates: string[]): string | null => {
    const firstDate = parseISO(weekDates[0]);
    const lastDate = parseISO(weekDates[weekDates.length - 1]);
    
    // Show label if this is the first week of the month or if month changes mid-week
    if (getMonth(firstDate) !== getMonth(lastDate)) {
      return format(lastDate, "MMM");
    }
    
    // Check if previous week was a different month
    const weekIndex = weeks.indexOf(weekDates);
    if (weekIndex > 0) {
      const prevWeek = weeks[weekIndex - 1];
      const prevFirstDate = parseISO(prevWeek[0]);
      if (getMonth(prevFirstDate) !== getMonth(firstDate)) {
        return format(firstDate, "MMM");
      }
    } else {
      return format(firstDate, "MMM");
    }
    
    return null;
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 md:p-6 rounded-xl border border-border/50 shadow-lg bg-card/50 backdrop-blur-sm">
        <div className="mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-foreground mb-1">
            Activity Heatmap
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground">
            Tap any day to see details • Scroll horizontally to view past year
          </p>
        </div>

        {/* Calendar Grid */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-1.5 md:gap-2 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(148, 163, 184, 0.3) transparent'
          }}
        >
          {weeks.map((week, weekIndex) => {
            const monthLabel = getMonthLabel(week);
            
            return (
              <div key={weekIndex} className="flex flex-col gap-1.5 md:gap-2 snap-start">
                {/* Month Label */}
                {monthLabel && (
                  <div className="text-[10px] md:text-xs font-medium text-muted-foreground/70 mb-1 text-center min-h-[16px]">
                    {monthLabel}
                  </div>
                )}
                {!monthLabel && <div className="min-h-[16px]" />}
                
                {/* Week Days */}
                {week.map((date, dayIndex) => {
                  const isToday = isSameDay(parseISO(date), new Date());
                  const dailyVictory = dailyVictoryByDate[date] || 0;
                  
                  return (
                    <button
                      key={date}
                      onClick={() => handleDayClick(date)}
                      className={`
                        w-8 h-8 md:w-10 md:h-10 
                        rounded-lg md:rounded-xl
                        ${getColor(date)}
                        ${isToday ? "ring-2 ring-purple ring-offset-2 ring-offset-background shadow-glow-purple scale-110" : ""}
                        hover:scale-110 active:scale-95
                        transition-all duration-200 ease-out
                        cursor-pointer touch-manipulation
                        focus:outline-none focus:ring-2 focus:ring-purple focus:ring-offset-2
                      `}
                      title={`${format(parseISO(date), "EEEE, MMM d, yyyy")} - ${dailyVictory}%`}
                      aria-label={`${format(parseISO(date), "MMMM d, yyyy")} - ${dailyVictory}% daily victory`}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-border/30">
          <p className="text-xs md:text-sm font-medium text-muted-foreground mb-3 text-center">
            Daily Victory Levels
          </p>
          <div className="flex items-center justify-center gap-3 md:gap-4 text-[10px] md:text-xs text-muted-foreground flex-wrap">
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-card/50">
              <div className="w-5 h-5 md:w-6 md:h-6 rounded-lg bg-gold/70 border border-gold shadow-glow-gold" />
              <span className="font-medium">Perfect</span>
              <span className="text-muted-foreground/70">(90-100%)</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-card/50">
              <div className="w-5 h-5 md:w-6 md:h-6 rounded-lg bg-purple/50 border border-purple/70" />
              <span className="font-medium">Great</span>
              <span className="text-muted-foreground/70">(60-89%)</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-card/50">
              <div className="w-5 h-5 md:w-6 md:h-6 rounded-lg bg-pink/30 border border-pink/50" />
              <span className="font-medium">Partial</span>
              <span className="text-muted-foreground/70">(1-59%)</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-card/50">
              <div className="w-5 h-5 md:w-6 md:h-6 rounded-lg bg-secondary border border-border/30" />
              <span className="font-medium">None</span>
              <span className="text-muted-foreground/70">(0%)</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-card/50">
              <div className="w-5 h-5 md:w-6 md:h-6 rounded-lg bg-pink/40 border border-pink/60" />
              <span className="font-medium">Missed</span>
            </div>
          </div>
        </div>
      </Card>

      {selectedDate && (
        <DayModal
          date={selectedDate}
          logs={selectedLogs}
          dailyVictory={dailyVictoryByDate[selectedDate] || 0}
          onClose={() => {
            setSelectedDate(null);
            setSelectedLogs(null);
          }}
        />
      )}
    </div>
  );
}
