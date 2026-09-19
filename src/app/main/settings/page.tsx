import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, Shield, Bell, Palette, CreditCard, LogOut } from "lucide-react";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/index");

  const sections = [
    { href: "/main/settings", icon: User, label: "Account", desc: "Username, email, CoolBlox ID" },
    { href: "/main/settings", icon: Shield, label: "Security", desc: "Password and sessions" },
    { href: "/main/settings", icon: Bell, label: "Notifications", desc: "Email and in-app alerts" },
    { href: "/main/settings", icon: Palette, label: "Appearance", desc: "Theme and language" },
    { href: "/main/subscription", icon: CreditCard, label: "Subscription", desc: "Plans and Whop billing" }
  ];

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Settings</h1>
      <p className="text-slate-400 mb-8 text-sm">Manage your COOLBLOX-GROX account</p>

      <div className="rounded-2xl bg-surface-800 border border-slate-700 p-4 mb-6">
        <p className="text-xs text-slate-500 mb-1">CoolBlox User ID</p>
        <p className="font-mono text-cool-400">{(session.user as any).coolbloxId}</p>
        <p className="text-xs text-slate-500 mt-3 mb-1">Username</p>
        <p className="font-medium">{(session.user as any).username}</p>
        <p className="text-xs text-slate-500 mt-3 mb-1">Email</p>
        <p className="font-medium">{session.user.email}</p>
      </div>

      <div className="space-y-2">
        {sections.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="flex items-center gap-4 p-4 rounded-xl bg-surface-800 border border-slate-700 hover:border-slate-600 transition"
          >
            <s.icon className="w-5 h-5 text-cool-400" />
            <div>
              <p className="font-medium text-sm">{s.label}</p>
              <p className="text-xs text-slate-500">{s.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
