import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Users, UserPlus, Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FriendsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  return (
    <div className="px-4 lg:px-8 max-w-3xl mx-auto py-4 lg:py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center">
            <Users className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Friends</h1>
            <p className="text-sm text-slate-400">0 friends · Social hub</p>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cool-600 text-white text-sm font-medium"
        >
          <UserPlus className="w-4 h-4" /> Add
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          placeholder="Find players by username…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-800 border border-slate-700 text-sm outline-none focus:border-cool-500"
        />
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
        {["All", "Online", "Requests", "Pending"].map((t, i) => (
          <button
            key={t}
            type="button"
            className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium border ${
              i === 0
                ? "bg-cool-600/20 border-cool-600/40 text-cool-400"
                : "bg-surface-800 border-slate-700 text-slate-400"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-dashed border-slate-700 p-10 text-center">
        <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <p className="font-medium text-slate-300">No friends yet</p>
        <p className="text-sm text-slate-500 mt-1">
          Search usernames to send friend requests. Play together soon.
        </p>
      </div>
    </div>
  );
}
