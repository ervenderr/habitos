import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPushNotification } from "@/lib/push";
import { format, parse } from "date-fns";

export async function POST(request: NextRequest) {
  // Verify this is a cron job (add your cron secret)
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const currentTime = format(now, "HH:mm");

    // Get users with notifications enabled
    const users = await prisma.user.findMany({
      include: {
        notificationSettings: true,
        pushSubscriptions: true,
      },
    });

    for (const user of users) {
      if (!user.notificationSettings?.enabled) continue;

      const { habitReminderTime, dailyReviewTime } = user.notificationSettings;

      // Send habit reminders
      if (habitReminderTime === currentTime) {
        const habits = await prisma.habit.findMany({
          where: {
            userId: user.id,
            active: true,
          },
        });

        for (const subscription of user.pushSubscriptions) {
          await sendPushNotification(
            {
              endpoint: subscription.endpoint,
              p256dh: subscription.p256dh,
              auth: subscription.auth,
            },
            {
              title: "Habit Reminder",
              body: `Don't forget to complete your ${habits.length} habit${habits.length > 1 ? "s" : ""}!`,
              url: "/dashboard",
            }
          );
        }
      }

      // Send daily review reminder
      if (dailyReviewTime === currentTime) {
        for (const subscription of user.pushSubscriptions) {
          await sendPushNotification(
            {
              endpoint: subscription.endpoint,
              p256dh: subscription.p256dh,
              auth: subscription.auth,
            },
            {
              title: "Daily Review",
              body: "Time for your daily review!",
              url: "/journal",
            }
          );
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notification error:", error);
    return NextResponse.json(
      { error: "Notification failed" },
      { status: 500 }
    );
  }
}

