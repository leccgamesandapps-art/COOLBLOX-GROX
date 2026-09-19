import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Play, Heart, Users, Plus } from "lucide-react";

async function getPublishedGames() {
  try {
    const games = await prisma.gameVersion.findMany({
      where: { isLatest: true, visibility: "public" },
      include: {
        project: {
          include: { owner: { select: { username: true, displayName: true } } }
        },
        _count: { select: { likes: true } }
      },
      orderBy: { publishedAt: "desc" },
      take: 24
    });
    return games;
  } catch {
    return [];
  }
}

export default async function MainHomePage() {
  const session = await getServerSession(authOptions);
  const games = await getPublishedGames();

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold">
          Welcome back, <span className="text-cool-400">{session?.user?.name || session?.user?.username}</span>
        </h1>
        <p className="text-slate-400 mt-1">Ready to create or play something cool?</p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
        <Link
          href="/studio"
          className="flex items-center gap-3 p-4 rounded-2xl bg-cool-600/20 border border-cool-600/30 hover:bg-cool-600/30 transition"
        >
          <Plus className="w-6 h-6 text-cool-400" />
          <div>
            <p className="font-semibold text-sm">Create</p>
            <p className="text-xs text-slate-400">Open Studio</p>
          </div>
        </Link>
        <Link
          href="/main/games"
          className="flex items-center gap-3 p-4 rounded-2xl bg-surface-800 border border-slate-700 hover:border-slate-600 transition"
        >
          <Play className="w-6 h-6 text-emerald-400" />
          <div>
            <p className="font-semibold text-sm">Play</p>
            <p className="text-xs text-slate-400">Discover games</p>
          </div>
        </Link>
        <Link
          href="/main/friends"
          className="flex items-center gap-3 p-4 rounded-2xl bg-surface-800 border border-slate-700 hover:border-slate-600 transition"
        >
          <Users className="w-6 h-6 text-violet-400" />
          <div>
            <p className="font-semibold text-sm">Friends</p>
            <p className="text-xs text-slate-400">Social</p>
          </div>
        </Link>
        <Link
          href="/main/favorites"
          className="flex items-center gap-3 p-4 rounded-2xl bg-surface-800 border border-slate-700 hover:border-slate-600 transition"
        >
          <Heart className="w-6 h-6 text-rose-400" />
          <div>
            <p className="font-semibold text-sm">Favorites</p>
            <p className="text-xs text-slate-400">Saved</p>
          </div>
        </Link>
      </div>

      {/* Featured / Recent Games */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Published Games</h2>
          <Link href="/main/games" className="text-sm text-cool-400 hover:underline">View all</Link>
        </div>

        {games.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 p-12 text-center">
            <p className="text-slate-400 mb-4">No published games yet.</p>
            <Link
              href="/studio"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cool-600 hover:bg-cool-500 text-white font-medium transition"
            >
              <Plus className="w-4 h-4" /> Create the first game
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {games.map((g) => (
              <Link
                key={g.id}
                href={`/main/game/${g.projectId}/${g.id}`}
                className="group rounded-2xl bg-surface-800 border border-slate-700 overflow-hidden hover:border-cool-500/50 transition"
              >
                <div className="aspect-video bg-surface-900 relative">
                  {g.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={g.thumbnail} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <Play className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <span className="px-4 py-2 rounded-full bg-cool-600 text-white text-sm font-medium flex items-center gap-2">
                      <Play className="w-4 h-4" /> Play
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold truncate">{g.project.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    by {g.project.owner.displayName || g.project.owner.username}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5" /> {g._count.likes}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
