"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { saveDailyNote } from "@/app/actions/journal";
import { format, parseISO } from "date-fns";
import { MoodSelector } from "./MoodSelector";

interface JournalEditorProps {
  initialNote: {
    mood: number | null;
    notes: string | null;
  } | null;
  date: string;
}

export function JournalEditor({ initialNote, date }: JournalEditorProps) {
  const [mood, setMood] = useState<number | null>(initialNote?.mood || null);
  const [notes, setNotes] = useState(initialNote?.notes || "");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      await saveDailyNote(date, mood, notes);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = format(parseISO(date), "EEEE, MMMM d, yyyy");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{formattedDate}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="mb-3 block">How are you feeling today?</Label>
          <MoodSelector value={mood} onChange={setMood} />
        </div>

        <div>
          <Label htmlFor="notes" className="mb-2 block">
            Notes
          </Label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full min-h-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="Write about your day..."
          />
        </div>

        <div className="flex justify-between items-center">
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : saved ? "Saved!" : "Save"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

