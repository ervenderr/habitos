"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface DisciplineChartProps {
  score7d: number;
  score30d: number;
  scoreAll: number;
}

export function DisciplineChart({
  score7d,
  score30d,
  scoreAll,
}: DisciplineChartProps) {
  const data = [
    { period: "7 Days", score: score7d },
    { period: "30 Days", score: score30d },
    { period: "All Time", score: scoreAll },
  ];

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="period" />
          <YAxis domain={[0, 100]} />
          <Tooltip formatter={(value: number) => `${value}%`} />
          <Bar dataKey="score" fill="#e2bc48" />
        </BarChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold">{score7d}%</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">7 Days</p>
        </div>
        <div>
          <p className="text-2xl font-bold">{score30d}%</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">30 Days</p>
        </div>
        <div>
          <p className="text-2xl font-bold">{scoreAll}%</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">All Time</p>
        </div>
      </div>
    </div>
  );
}

