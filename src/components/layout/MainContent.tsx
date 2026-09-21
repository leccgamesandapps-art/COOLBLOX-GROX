"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isInGame = pathname?.startsWith("/main/game/") ?? false;

  return (
    <main
      className={cn(
        "flex-1 lg:ml-0 overflow-x-hidden",
        isInGame
          ? "pt-0 pb-0"
          : "pt-14 pb-20 lg:pt-0 lg:pb-0"
      )}
    >
      {children}
    </main>
  );
}
