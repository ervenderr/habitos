import { openDB, DBSchema, IDBPDatabase } from "idb";

interface HabitosDB extends DBSchema {
  habits: {
    key: string;
    value: {
      id: string;
      name: string;
      description?: string;
      frequency: string;
      active: boolean;
      synced: boolean;
    };
  };
  habitLogs: {
    key: string;
    value: {
      id: string;
      habitId: string;
      date: string;
      completed: boolean;
      synced: boolean;
    };
    indexes: { "by-habit-date": [string, string] };
  };
  syncQueue: {
    key: number;
    value: {
      id?: number;
      type: "logHabit" | "createHabit" | "updateHabit" | "deleteHabit";
      data: any;
      timestamp: number;
    };
  };
}

let db: IDBPDatabase<HabitosDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<HabitosDB>> {
  if (db) return db;

  db = await openDB<HabitosDB>("habitos", 1, {
    upgrade(database) {
      // Habits store
      if (!database.objectStoreNames.contains("habits")) {
        database.createObjectStore("habits");
      }

      // Habit logs store
      if (!database.objectStoreNames.contains("habitLogs")) {
        const logStore = database.createObjectStore("habitLogs");
        logStore.createIndex("by-habit-date", ["habitId", "date"]);
      }

      // Sync queue store
      if (!database.objectStoreNames.contains("syncQueue")) {
        database.createObjectStore("syncQueue", {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    },
  });

  return db;
}

// Habits
export async function saveHabitToIndexedDB(habit: any) {
  const database = await getDB();
  await database.put("habits", { ...habit, synced: false }, habit.id);
}

export async function getHabitsFromIndexedDB() {
  const database = await getDB();
  return database.getAll("habits");
}

// Habit Logs
export async function saveHabitLogToIndexedDB(log: any) {
  const database = await getDB();
  const key = `${log.habitId}-${log.date}`;
  await database.put("habitLogs", { ...log, synced: false }, key);
}

export async function getHabitLogsFromIndexedDB(habitId?: string) {
  const database = await getDB();
  if (habitId) {
    const tx = database.transaction("habitLogs", "readonly");
    const index = tx.store.index("by-habit-date");
    const logs = await index.getAll(IDBKeyRange.bound([habitId, ""], [habitId, "\uffff"]));
    await tx.done;
    return logs;
  }
  return database.getAll("habitLogs");
}

// Sync Queue
export async function addToSyncQueue(type: string, data: any) {
  const database = await getDB();
  await database.add("syncQueue", {
    type: type as any,
    data,
    timestamp: Date.now(),
  });
}

export async function getSyncQueue() {
  const database = await getDB();
  return database.getAll("syncQueue");
}

export async function removeFromSyncQueue(id: number) {
  const database = await getDB();
  await database.delete("syncQueue", id);
}

