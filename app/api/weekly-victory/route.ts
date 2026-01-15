import { NextResponse } from "next/server";
import { getWeeklyVictoryPercent } from "@/app/actions/weeklyVictory";

// Prevent static analysis during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const percent = await getWeeklyVictoryPercent();
    return NextResponse.json({ percent });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to calculate weekly victory" },
      { status: 500 }
    );
  }
}

