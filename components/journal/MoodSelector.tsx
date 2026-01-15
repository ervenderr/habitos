"use client";

interface MoodSelectorProps {
  value: number | null;
  onChange: (value: number | null) => void;
}

const moods = [
  { value: 1, emoji: "😢", label: "Very Bad" },
  { value: 2, emoji: "😞", label: "Bad" },
  { value: 3, emoji: "😐", label: "Okay" },
  { value: 4, emoji: "🙂", label: "Good" },
  { value: 5, emoji: "😄", label: "Great" },
];

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div className="flex gap-2">
      {moods.map((mood) => (
        <button
          key={mood.value}
          onClick={() => onChange(value === mood.value ? null : mood.value)}
          className={`flex-1 p-4 rounded-lg border-2 transition-all ${
            value === mood.value
              ? "border-green-500 bg-green-50 dark:bg-green-900/20"
              : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
          }`}
        >
          <div className="text-3xl mb-1">{mood.emoji}</div>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            {mood.label}
          </div>
        </button>
      ))}
    </div>
  );
}

