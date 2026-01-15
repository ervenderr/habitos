"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createHabit, updateHabit } from "@/app/actions/habits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Habit } from "@prisma/client";
import { cn } from "@/lib/utils";

interface HabitFormProps {
  habit?: Habit;
}

export function HabitForm({ habit }: HabitFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [habitType, setHabitType] = useState<"binary" | "count">(
    (habit?.type as "binary" | "count") || "binary"
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      
      if (habit) {
        formData.append("id", habit.id);
        await updateHabit(formData);
      } else {
        await createHabit(formData);
      }

      router.push("/habits");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <div>
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          name="name"
          required
          defaultValue={habit?.name}
          placeholder="e.g., Exercise, Read, Meditate"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          defaultValue={habit?.description || ""}
          placeholder="Optional description"
        />
      </div>

      <div>
        <Label>Habit Type</Label>
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => setHabitType("binary")}
            className={cn(
              "flex-1 px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium",
              habitType === "binary"
                ? "bg-purple/20 border-purple text-purple"
                : "bg-card border-border text-muted-foreground hover:border-purple/50"
            )}
          >
            Binary (Yes/No)
          </button>
          <button
            type="button"
            onClick={() => setHabitType("count")}
            className={cn(
              "flex-1 px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium",
              habitType === "count"
                ? "bg-purple/20 border-purple text-purple"
                : "bg-card border-border text-muted-foreground hover:border-purple/50"
            )}
          >
            Count (Track Progress)
          </button>
        </div>
        <input type="hidden" name="type" value={habitType} />
        <p className="text-xs text-muted-foreground mt-2">
          {habitType === "binary"
            ? "Simple yes/no habit (e.g., Exercise, Meditate)"
            : "Track progress toward a target (e.g., 10,000 steps, 8 glasses of water)"}
        </p>
      </div>

      {habitType === "count" && (
        <div>
          <Label htmlFor="target">Daily Target</Label>
          <Input
            id="target"
            name="target"
            type="number"
            min="1"
            required={habitType === "count"}
            defaultValue={habit?.target && habit.target > 1 ? habit.target : 10}
            placeholder="e.g., 10"
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            The number you want to reach each day
          </p>
        </div>
      )}

      <input type="hidden" name="target" value={habitType === "binary" ? "1" : ""} />

      <div>
        <Label htmlFor="frequency">Frequency</Label>
        <select
          id="frequency"
          name="frequency"
          defaultValue={habit?.frequency || "daily"}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="daily" className="bg-background text-foreground">Daily</option>
          <option value="weekly" className="bg-background text-foreground">Weekly</option>
        </select>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : habit ? "Update" : "Create"} Habit
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
