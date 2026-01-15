import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runDailyReset } from "@/lib/dailyReset";

// Prevent static analysis during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  // Verify this is a cron job
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const users = await prisma.user.findMany();

    for (const user of users) {
      await runDailyReset(user.id);
    }

    return NextResponse.json({ success: true, usersProcessed: users.length });
  } catch (error) {
    console.error("Daily reset error:", error);
    return NextResponse.json(
      { error: "Daily reset failed" },
      { status: 500 }
    );
  }
}

