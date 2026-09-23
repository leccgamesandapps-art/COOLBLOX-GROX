import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User, Shirt, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AvatarPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  const user = session.user as any;

  return (
    <div className="px-4 lg:px-8 max-w-4xl mx-auto py-4 lg:py-8">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <User className="w-6 h-6 text-cool-400" /> Avatar
      </h1>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-3xl bg-gradient-to-b from-surface-800 to-surface-900 border border-slate-700 p-8 flex flex-col items-center">
          <div className="w-36 h-36 rounded-full bg-gradient-to-br from-cool-500 to-violet-600 flex items-center justify-center text-5xl font-bold shadow-2xl shadow-cool-600/30 ring-4 ring-cool-600/20">
            {(user.username || "?")[0]?.toUpperCase()}
          </div>
          <p className="font-bold text-xl mt-5">{user.name || user.username}</p>
          <p className="text-sm text-slate-400">@{user.username}</p>
          <p className="text-xs text-cool-400 font-mono mt-2 px-3 py-1 rounded-full bg-cool-600/10">
            {user.coolbloxId}
          </p>
          <div className="flex gap-2 mt-6">
            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-cool-600 text-white text-sm font-medium"
            >
              Customize
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-surface-800 border border-slate-600 text-sm"
            >
              Share
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl bg-surface-800 border border-slate-700 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Shirt className="w-5 h-5 text-amber-400" />
              <h2 className="font-semibold">Outfit</h2>
            </div>
            <p className="text-sm text-slate-400">
              Clothing and accessories will appear here. Inventory items can be equipped soon.
            </p>
          </div>
          <div className="rounded-2xl bg-surface-800 border border-slate-700 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-violet-400" />
              <h2 className="font-semibold">Emotes</h2>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {["Wave", "Dance", "Point", "Cheer"].map((e) => (
                <div
                  key={e}
                  className="aspect-square rounded-xl bg-surface-900 border border-slate-700 flex items-center justify-center text-[10px] text-slate-400"
                >
                  {e}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
