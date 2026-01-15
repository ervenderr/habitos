import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { logHabit } from "@/app/actions/habitLogs";
import { createHabit, updateHabit, deleteHabit } from "@/app/actions/habits";

// Prevent static analysis during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const item = await request.json();

    switch (item.type) {
      case "logHabit":
        await logHabit(item.data.habitId, item.data.date, item.data.completed);
        break;
      case "createHabit":
        const formData = new FormData();
        Object.entries(item.data).forEach(([key, value]) => {
          formData.append(key, value as string);
        });
        await createHabit(formData);
        break;
      case "updateHabit":
        const updateFormData = new FormData();
        Object.entries(item.data).forEach(([key, value]) => {
          updateFormData.append(key, value as string);
        });
        await updateHabit(updateFormData);
        break;
      case "deleteHabit":
        await deleteHabit(item.data.id);
        break;
      default:
        return NextResponse.json({ error: "Unknown sync type" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { error: "Sync failed" },
      { status: 500 }
    );
  }
}

