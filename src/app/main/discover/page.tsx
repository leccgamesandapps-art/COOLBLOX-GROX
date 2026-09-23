import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Compass, Search } from "lucide-react";
import { GameCard, type GameCardData } from "@/components/ui/GameCard";
import { CategoryChips } from "@/components/ui/CategoryChips";

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

  const cards: GameCardData[] = games.map((g) => ({
    id: g.id,
    projectId: g.projectId,
    name: g.project.name,
    creator: g.project.owner.displayName || g.project.owner.username,
    likes: g._count?.likes ?? 0,
    thumbnail: g.thumbnail
  }));

  return (
    <div className="px-4 lg:px-8 max-w-7xl mx-auto py-4 lg:py-8">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-cool-600/20 flex items-center justify-center">
          <Compass className="w-5 h-5 text-cool-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Discover</h1>
          <p className="text-sm text-slate-400">Find something new to play</p>
        </div>
      </div>

      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="search"
          placeholder="Search experiences, creators…"
          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-surface-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:border-cool-500 focus:ring-1 focus:ring-cool-500 outline-none"
        />
      </div>

      <div className="mb-6">
        <CategoryChips />
      </div>

      {cards.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700 p-12 text-center text-slate-400">
          <p className="mb-2 font-medium text-slate-300">Nothing published yet</p>
          <p className="text-sm">When creators publish games, they appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {cards.map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </div>
      )}
    </div>
  );
}
