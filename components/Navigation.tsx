"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/app/actions/auth";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/habits", label: "Habits", icon: "✅" },
  { href: "/calendar", label: "Calendar", icon: "📅" },
  { href: "/stats", label: "Stats", icon: "📈" },
  { href: "/journal", label: "Journal", icon: "📝" },
];

export function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation - Top Bar */}
      <nav className="hidden md:block border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="text-xl font-bold text-purple">
              HabitOS
            </Link>
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px] flex items-center",
                    pathname === item.href
                      ? "bg-purple text-foreground shadow-glow-purple"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-200 min-h-[44px]"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border/50 bg-card/95 backdrop-blur-sm z-50 safe-area-inset-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg min-h-[44px] min-w-[44px] transition-all duration-200",
                pathname === item.href
                  ? "text-purple"
                  : "text-muted-foreground"
              )}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Top Bar with Menu */}
      <div className="md:hidden border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center justify-between h-14 px-4">
          <Link href="/dashboard" className="text-lg font-bold text-purple">
            HabitOS
          </Link>
          <div className="flex items-center gap-3">
            <form action={signOutAction}>
              <button
                type="submit"
                className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground min-h-[44px]"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
