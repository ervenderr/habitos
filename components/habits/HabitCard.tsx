"use client";

import { Habit } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HabitCardProps {
  habit: Habit;
  onDelete: (id: string) => void;
}

export function HabitCard({ habit, onDelete }: HabitCardProps) {
  return (
    <Card className="rounded-xl border border-border/50 shadow-soft">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl text-foreground">{habit.name}</CardTitle>
            {habit.description && (
              <CardDescription className="mt-2 text-muted-foreground">
                {habit.description}
              </CardDescription>
            )}
          </div>
          <div className="flex gap-2">
            <Link href={`/habits/${habit.id}/edit`}>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </Link>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(habit.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground uppercase tracking-wider">
          Frequency: {habit.frequency}
        </p>
      </CardContent>
    </Card>
  );
}

