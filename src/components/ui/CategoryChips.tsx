"use client";

import Link from "next/link";
import {
  Gamepad2,
  Swords,
  Home,
  Car,
  Ghost,
  Puzzle,
  Mountain,
  Sparkles
} from "lucide-react";

const CATS = [
  { label: "All", href: "/main/discover", icon: Sparkles, color: "text-cool-400" },
  { label: "Obby", href: "/main/discover?c=obby", icon: Mountain, color: "text-emerald-400" },
  { label: "Simulator", href: "/main/discover?c=sim", icon: Gamepad2, color: "text-amber-400" },
  { label: "Horror", href: "/main/discover?c=horror", icon: Ghost, color: "text-violet-400" },
  { label: "Tycoon", href: "/main/discover?c=tycoon", icon: Home, color: "text-sky-400" },
  { label: "Racing", href: "/main/discover?c=racing", icon: Car, color: "text-rose-400" },
  { label: "PvP", href: "/main/discover?c=pvp", icon: Swords, color: "text-red-400" },
  { label: "Puzzle", href: "/main/discover?c=puzzle", icon: Puzzle, color: "text-teal-400" }
];

export function CategoryChips() {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
      {CATS.map((c) => (
        <Link
          key={c.label}
          href={c.href}
          className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-surface-800 border border-slate-700/80 text-xs font-medium text-slate-200 hover:border-cool-500/40 hover:bg-surface-800/90 transition active:scale-95"
        >
          <c.icon className={`w-3.5 h-3.5 ${c.color}`} />
          {c.label}
        </Link>
      ))}
    </div>
  );
}
