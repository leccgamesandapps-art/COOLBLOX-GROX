"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Home, Compass, Gamepad2, Users, MessageSquare,
  User, Package, Heart, Coins, Settings,
  PenTool, LogOut, Menu, X
} from "lucide-react";
import { useState } from "react";
import { cn, formatCoins } from "@/lib/utils";

const navItems = [
  { href: "/main/main", label: "Home", icon: Home },
  { href: "/main/discover", label: "Discover", icon: Compass },
  { href: "/main/games", label: "Games", icon: Gamepad2 },
  { href: "/main/friends", label: "Friends", icon: Users },
  { href: "/main/messages", label: "Messages", icon: MessageSquare },
  { href: "/studio", label: "Studio", icon: PenTool },
];

export function MainNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = session?.user;

  return (
    <>
      <aside className="hidden lg:flex flex-col w-64 bg-surface-900 border-r border-slate-800 h-screen sticky top-0">
        <div className="p-4 border-b border-slate-800">
          <Link href="/main/main" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-cool-600 flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">COOLBLOX<span className="text-cool-400">-GROX</span></span>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition",
                  active ? "bg-cool-600/20 text-cool-400" : "text-slate-400 hover:bg-surface-800 hover:text-white"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-slate-800 space-y-1">
            <Link href="/main/avatar" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-surface-800 hover:text-white">
              <User className="w-5 h-5" /> Avatar
            </Link>
            <Link href="/main/inventory" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-surface-800 hover:text-white">
              <Package className="w-5 h-5" /> Inventory
            </Link>
            <Link href="/main/favorites" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-surface-800 hover:text-white">
              <Heart className="w-5 h-5" /> Favorites
            </Link>
            <Link href="/main/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-surface-800 hover:text-white">
              <Settings className="w-5 h-5" /> Settings
            </Link>
          </div>
        </nav>

        <div className="p-3 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-9 h-9 rounded-full bg-cool-700 flex items-center justify-center text-sm font-bold">
              {user?.username?.[0]?.toUpperCase() || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || user?.username}</p>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Coins className="w-3 h-3 text-amber-400" />
                {formatCoins(user?.coolCoins ?? 0)} Cool Coins
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="p-2 rounded-lg text-slate-400 hover:bg-surface-800 hover:text-red-400 transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-surface-900/95 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <Link href="/main/main" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cool-600 flex items-center justify-center">
            <Gamepad2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold">COOLBLOX</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs text-amber-400 flex items-center gap-1">
            <Coins className="w-3.5 h-3.5" /> {formatCoins(user?.coolCoins ?? 0)}
          </span>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/60" onClick={() => setMobileOpen(false)}>
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-surface-900 p-4 pt-16" onClick={(e) => e.stopPropagation()}>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-slate-300 hover:bg-surface-800">
                  <item.icon className="w-5 h-5" /> {item.label}
                </Link>
              ))}
              <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-red-400 w-full">
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </nav>
          </div>
        </div>
      )}

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-900 border-t border-slate-800 flex justify-around py-2">
        {[navItems[0], navItems[1], navItems[2], navItems[5], { href: "/main/settings", label: "More", icon: Settings }].map((item) => (
          <Link key={item.href} href={item.href} className="flex flex-col items-center gap-0.5 px-2 py-1 text-xs text-slate-400">
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
