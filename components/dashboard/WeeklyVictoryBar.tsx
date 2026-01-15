"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface WeeklyVictoryBarProps {
  percent: number;
}

export function WeeklyVictoryBar({ percent }: WeeklyVictoryBarProps) {
  const getColor = () => {
    if (percent >= 90) return "bg-gold";
    if (percent >= 60) return "bg-purple";
    if (percent > 0) return "bg-pink";
    return "bg-secondary";
  };

  const getGlow = () => {
    if (percent >= 90) return "shadow-glow-gold";
    if (percent >= 60) return "shadow-glow-purple";
    return "";
  };

  const getBorderColor = () => {
    if (percent >= 90) return "border-gold/50";
    if (percent >= 60) return "border-purple/50";
    if (percent > 0) return "border-pink/50";
    return "border-border/50";
  };

  return (
    <Card className={cn("p-4 md:p-6 rounded-xl border shadow-lg", getBorderColor())}>
      <div className="mb-3 md:mb-4 flex justify-between items-center">
        <h2 className="text-lg md:text-xl font-bold text-foreground">Weekly Victory</h2>
        <span className="text-xl md:text-2xl font-extrabold text-foreground">
          {percent}%
        </span>
      </div>
      <div className="w-full bg-secondary rounded-full h-4 md:h-5 overflow-hidden border border-border/30">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            getColor(),
            getGlow()
          )}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
      <div className="mt-3 flex items-center justify-between text-xs md:text-sm text-muted-foreground">
        <span>0%</span>
        <span className="text-center">
          {percent >= 90 && "🏆 Perfect Week"}
          {percent >= 60 && percent < 90 && "✨ Great Week"}
          {percent > 0 && percent < 60 && "💪 Keep Going"}
          {percent === 0 && "Start Your Week"}
        </span>
        <span>100%</span>
      </div>
    </Card>
  );
}

