"use client";

import { Card } from "@/components/ui/card";

interface ProgressBarProps {
  progress: number;
  completed: number;
  total: number;
}

export function ProgressBar({ progress, completed, total }: ProgressBarProps) {
  return (
    <Card className="p-4 md:p-8 rounded-xl border border-purple/20 shadow-soft">
      <div className="mb-4 md:mb-6 flex justify-between items-center">
        <h2 className="text-lg md:text-xl font-semibold text-foreground">Today's Progress</h2>
        <span className="text-sm text-muted-foreground font-medium">
          {completed} / {total}
        </span>
      </div>
      <div className="w-full bg-secondary rounded-full h-3 md:h-4 overflow-hidden border border-purple/30">
        <div
          className="bg-gold h-full rounded-full transition-all duration-500 ease-out shadow-glow-gold"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs md:text-sm text-muted-foreground mt-3 md:mt-4 text-center">
        {Math.round(progress)}% complete
      </p>
    </Card>
  );
}

