"use client";

import { useEffect } from "react";
import { setupOnlineSync } from "@/lib/sync";
import { OfflineIndicator } from "./OfflineIndicator";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Register service worker only in production (not localhost)
    // In development, Next.js dev server can cause redirect issues with sw.js
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      !window.location.hostname.includes("localhost") &&
      !window.location.hostname.includes("127.0.0.1")
    ) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((registration) => {
          console.log("Service Worker registered:", registration);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }

    // Setup online sync
    setupOnlineSync();
  }, []);

  return (
    <>
      {children}
      <OfflineIndicator />
    </>
  );
}

