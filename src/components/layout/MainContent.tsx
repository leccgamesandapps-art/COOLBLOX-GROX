"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isInGame =
    typeof pathname === "string" && pathname.startsWith("/main/game/");

  // In-game: no padding — game layout is fixed fullscreen
  if (isInGame) {
    return <main className="flex-1 min-h-0">{children}</main>;
  }

  return (
    <main
      className={cn(
        "flex-1 lg:ml-0 overflow-x-hidden",
        "pt-14 pb-20 lg:pt-0 lg:pb-0"
      )}
    >
      {children}
    </main>
  );
}
