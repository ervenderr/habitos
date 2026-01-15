import { getDailyNote } from "@/app/actions/journal";
import { JournalEditor } from "@/components/journal/JournalEditor";
import { DashboardLayout } from "@/components/DashboardLayout";
import { format } from "date-fns";

export default async function JournalPage() {
  const today = format(new Date(), "yyyy-MM-dd");
  const note = await getDailyNote(today);

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6 md:py-12 max-w-2xl pb-20 md:pb-12">
        <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-12 text-foreground">Journal</h1>
        <JournalEditor initialNote={note} date={today} />
      </div>
    </DashboardLayout>
  );
}

