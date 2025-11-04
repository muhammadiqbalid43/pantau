"use client";

import { cn } from "@/lib/utils";
import { Home, Settings, TrendingUp } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    href: "/dashboard/home",
    icon: Home,
    label: "Home",
  },
  {
    href: "/dashboard/progress",
    icon: TrendingUp,
    label: "Progress",
  },
  {
    href: "/dashboard/settings",
    icon: Settings,
    label: "Settings",
  },
];

interface BottomTabsProps {
  className?: string;
}

const BottomNav = ({ className }: BottomTabsProps) => {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-background border-t border-border",
        "backdrop-blur-lg bg-background/95",
        "supports-[backdrop-filter]:bg-background/80",
        className
      )}
      style={{
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="flex items-center justify-around h-16 px-4 max-w-2xl mx-auto">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1",
                "flex-1 h-full relative",
                "transition-all duration-200 ease-in-out",
                "active:scale-95",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative flex justify-center items-center flex-col gap-1">
                <Icon
                  className={cn(
                    "h-5 w-5 transition-transform duration-200",
                    isActive && "scale-110"
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />

                <span
                  className={cn(
                    "text-xs font-medium transition-all duration-200",
                    isActive ? "scale-100 opacity-100" : "scale-95 opacity-70"
                  )}
                >
                  {tab.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
