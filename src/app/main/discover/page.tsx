import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Play, Heart, Compass, Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DiscoverPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  let games: any[] = [];
  try {
    games = await prisma.gameVersion.findMany({
      where: { isLatest: true, visibility: "public" },
      include: {
        project: {
          include: { owner: { select: { username: true, displayName: true } } }
        },
        _count: { select: { likes: true } }
      },
      orderBy: { publishedAt: "desc" },
      take: 48
    });
  } catch {}

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Compass className="w-7 h-7 text-cool-400" />
        <div>
          <h1 className="text-2xl font-bold">Discover</h1>
          <p className="text-sm text-slate-400">Find games published by the community</p>
        </div>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="search"
          placeholder="Search games (coming soon)"
          disabled
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-800 border border-slate-700 text-sm text-slate-400"
        />
      </div>

      {games.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700 p-12 text-center text-slate-400">
          <p className="mb-2">No public games yet.</p>
          <p className="text-sm">Create one in Studio and hit Publish — it will show here.</p>
          <Link href="/studio" className="inline-block mt-4 px-4 py-2 rounded-xl bg-cool-600 text-white text-sm">
            Open Studio
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {games.map((g) => (
            <Link
              key={g.id}
              href={`/main/game/${g.projectId}/${g.id}`}
              className="rounded-2xl bg-surface-800 border border-slate-700 overflow-hidden hover:border-cool-500/50 transition"
            >
              <div className="aspect-video bg-surface-900 flex items-center justify-center">
                <Play className="w-10 h-10 text-slate-600" />
              </div>
              <div className="p-3">
                <h3 className="font-semibold truncate">{g.project.name}</h3>
                <p className="text-xs text-slate-400">
                  by {g.project.owner.displayName || g.project.owner.username}
                </p>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <Heart className="w-3 h-3" /> {g._count.likes}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
