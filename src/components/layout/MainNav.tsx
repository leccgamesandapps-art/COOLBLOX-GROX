"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Home,
  Compass,
  Gamepad2,
  Users,
  MessageSquare,
  User,
  Package,
  Heart,
  Coins,
  Settings,
  PenTool,
  LogOut,
  Menu,
  X,
  Plus,
  Crown
} from "lucide-react";
import { useState } from "react";
import { cn, formatCoins } from "@/lib/utils";

const navItems = [
  { href: "/main/main", label: "Home", icon: Home },
  { href: "/main/discover", label: "Discover", icon: Compass },
  { href: "/main/games", label: "Games", icon: Gamepad2 },
  { href: "/main/friends", label: "Friends", icon: Users },
  { href: "/main/messages", label: "Chat", icon: MessageSquare },
  { href: "/studio", label: "Studio", icon: PenTool }
];

export function MainNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = session?.user;

  const isInGame =
    typeof pathname === "string" &&
    (pathname.startsWith("/main/game/") || pathname.includes("/main/game/"));

  if (isInGame) return null;

  const isActive = (href: string) =>
    pathname === href || (href !== "/main/main" && pathname?.startsWith(href));

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-[260px] bg-surface-900 border-r border-slate-800 h-screen sticky top-0 z-40">
        <div className="p-4 border-b border-slate-800">
          <Link href="/main/main" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cool-500 to-cool-700 flex items-center justify-center shadow-lg shadow-cool-600/20">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-base leading-tight block">
                COOLBLOX<span className="text-cool-400">-GROX</span>
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">Play · Create</span>
            </div>
          </Link>
        </div>

        <div className="p-3">
          <Link
            href="/studio"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-cool-600 hover:bg-cool-500 text-white text-sm font-semibold shadow-lg shadow-cool-600/25 transition"
          >
            <Plus className="w-4 h-4" /> Create
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition",
                  active
                    ? "bg-cool-600/15 text-cool-400"
                    : "text-slate-400 hover:bg-surface-800 hover:text-white"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}

          <div className="pt-4 mt-3 border-t border-slate-800 space-y-0.5">
            <Link href="/main/avatar" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-surface-800 hover:text-white">
              <User className="w-5 h-5" /> Avatar
            </Link>
            <Link href="/main/inventory" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-surface-800 hover:text-white">
              <Package className="w-5 h-5" /> Inventory
            </Link>
            <Link href="/main/favorites" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-surface-800 hover:text-white">
              <Heart className="w-5 h-5" /> Favorites
            </Link>
            <Link href="/main/subscription" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-surface-800 hover:text-white">
              <Crown className="w-5 h-5 text-amber-400" /> Premium
            </Link>
            <Link href="/main/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-surface-800 hover:text-white">
              <Settings className="w-5 h-5" /> Settings
            </Link>
          </div>
        </nav>

        <div className="p-3 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-surface-800/50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cool-500 to-violet-600 flex items-center justify-center text-sm font-bold ring-2 ring-cool-600/30">
              {user?.username?.[0]?.toUpperCase() || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || user?.username}</p>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Coins className="w-3 h-3 text-amber-400" />
                {formatCoins(user?.coolCoins ?? 0)}
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="p-2 rounded-lg text-slate-400 hover:bg-surface-800 hover:text-red-400"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-surface-900/95 backdrop-blur-md border-b border-slate-800/80 px-3 py-2.5 flex items-center justify-between safe-top">
        <Link href="/main/main" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cool-500 to-cool-700 flex items-center justify-center">
            <Gamepad2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm">COOLBLOX</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs text-amber-400 flex items-center gap-1 font-medium px-2 py-1 rounded-full bg-amber-400/10">
            <Coins className="w-3.5 h-3.5" /> {formatCoins(user?.coolCoins ?? 0)}
          </span>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute right-0 top-0 bottom-0 w-72 bg-surface-900 p-4 pt-16 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-slate-300 hover:bg-surface-800"
                >
                  <item.icon className="w-5 h-5" /> {item.label}
                </Link>
              ))}
              <Link href="/main/avatar" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-slate-300 hover:bg-surface-800">
                <User className="w-5 h-5" /> Avatar
              </Link>
              <Link href="/main/settings" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-slate-300 hover:bg-surface-800">
                <Settings className="w-5 h-5" /> Settings
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-red-400 w-full"
              >
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Mobile bottom nav — app style with center Create */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-900/95 backdrop-blur-md border-t border-slate-800 flex items-end justify-around pt-1 pb-safe">
        {[
          navItems[0],
          navItems[1],
          { href: "/studio", label: "Create", icon: Plus, special: true },
          navItems[2],
          { href: "/main/avatar", label: "Avatar", icon: User }
        ].map((item: any) =>
          item.special ? (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center -mt-4 px-2"
            >
              <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cool-500 to-cool-700 flex items-center justify-center shadow-lg shadow-cool-600/40 text-white">
                <Plus className="w-6 h-6" />
              </span>
              <span className="text-[10px] text-cool-400 font-medium mt-0.5">{item.label}</span>
            </Link>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-2 text-[10px] min-w-[56px]",
                isActive(item.href) ? "text-cool-400" : "text-slate-500"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        )}
      </nav>
    </>
  );
}
