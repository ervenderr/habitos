import webpush from "web-push";

export function getVapidKeys() {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || "mailto:admin@habitos.app";

  if (!publicKey || !privateKey) {
    throw new Error("VAPID keys not configured");
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);

  return { publicKey, privateKey };
}

export async function sendPushNotification(
  subscription: {
    endpoint: string;
    p256dh: string;
    auth: string;
  },
  payload: {
    title: string;
    body: string;
    url?: string;
  }
) {
  try {
    getVapidKeys(); // Initialize VAPID
    
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh,
          auth: subscription.auth,
        },
      },
      JSON.stringify({
        title: payload.title,
        body: payload.body,
        url: payload.url || "/dashboard",
      })
    );
  } catch (error) {
    console.error("Error sending push notification:", error);
    throw error;
  }
}

