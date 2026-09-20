import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AvatarPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const user = session.user as any;

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <User className="w-6 h-6 text-cool-400" /> Avatar
      </h1>
      <div className="rounded-2xl bg-surface-800 border border-slate-700 p-8 text-center">
        <div className="w-24 h-24 mx-auto rounded-full bg-cool-700 flex items-center justify-center text-3xl font-bold mb-4">
          {(user.username || "?")[0]?.toUpperCase()}
        </div>
        <p className="font-semibold text-lg">{user.name || user.username}</p>
        <p className="text-sm text-slate-400 mt-1">@{user.username}</p>
        <p className="text-xs text-cool-400 font-mono mt-2">{user.coolbloxId}</p>
        <p className="text-sm text-slate-500 mt-6">Custom avatar editor coming in a future update.</p>
      </div>
    </div>
  );
}
