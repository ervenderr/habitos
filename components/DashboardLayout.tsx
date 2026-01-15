"use client";

import { Navigation } from "./Navigation";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
}

