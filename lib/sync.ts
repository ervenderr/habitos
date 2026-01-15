import {
  getSyncQueue,
  removeFromSyncQueue,
  getHabitsFromIndexedDB,
  getHabitLogsFromIndexedDB,
} from "./indexeddb";

export async function syncOfflineData() {
  if (!navigator.onLine) {
    return { success: false, message: "Offline" };
  }

  try {
    const queue = await getSyncQueue();
    const results = [];

    for (const item of queue) {
      if (!item.id) continue; // Skip items without ID
      
      try {
        // Call API endpoints instead of server actions
        const response = await fetch("/api/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });

        if (response.ok) {
          await removeFromSyncQueue(item.id);
          results.push({ id: item.id, success: true });
        } else {
          throw new Error("Sync failed");
        }
      } catch (error) {
        console.error(`Error syncing item ${item.id}:`, error);
        results.push({ id: item.id, success: false, error });
      }
    }

    return { success: true, results };
  } catch (error) {
    console.error("Sync error:", error);
    return { success: false, error };
  }
}

export function setupOnlineSync() {
  if (typeof window === "undefined") return;

  window.addEventListener("online", async () => {
    console.log("Online - syncing data...");
    await syncOfflineData();
    window.location.reload(); // Refresh to get latest data
  });
}

