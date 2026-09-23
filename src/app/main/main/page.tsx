import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Sparkles, Bell, Search } from "lucide-react";
import { GameCard, type GameCardData } from "@/components/ui/GameCard";
import { SectionRow } from "@/components/ui/SectionRow";
import { CategoryChips } from "@/components/ui/CategoryChips";

export const dynamic = "force-dynamic";

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
      take: 36
    });
    return games;
  } catch {
    return [];
  }
}

function toCard(g: any): GameCardData {
  return {
    id: g.id,
    projectId: g.projectId,
    name: g.project.name,
    creator: g.project.owner.displayName || g.project.owner.username,
    likes: g._count?.likes ?? 0,
    thumbnail: g.thumbnail
  };
}

export default async function MainHomePage() {
  const session = await getServerSession(authOptions);
  const games = await getPublishedGames();
  const cards = games.map(toCard);
  const name = session?.user?.name || session?.user?.username || "Player";
  const featured = cards[0];
  const popular = [...cards].sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
  const newest = cards;

  return (
    <div className="pb-4">
      {/* App top strip */}
      <div className="sticky top-0 z-30 lg:static bg-surface-950/90 backdrop-blur border-b border-slate-800/80 lg:border-0 px-4 py-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] text-slate-500 uppercase tracking-wider">Home</p>
          <h1 className="text-lg font-bold truncate">Hey, {name}</h1>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Link
            href="/main/discover"
            className="p-2.5 rounded-xl bg-surface-800 border border-slate-700 text-slate-300 hover:text-white"
          >
            <Search className="w-5 h-5" />
          </Link>
          <button
            type="button"
            className="p-2.5 rounded-xl bg-surface-800 border border-slate-700 text-slate-300 relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cool-500" />
          </button>
        </div>
      </div>

      <div className="px-4 lg:px-8 max-w-7xl mx-auto pt-4">
        {/* Hero / Featured */}
        {featured ? (
          <Link
            href={`/main/game/${featured.projectId}/${featured.id}`}
            className="block relative rounded-3xl overflow-hidden mb-6 card-shine group border border-slate-700/50"
          >
            <div className="aspect-[21/9] sm:aspect-[2.4/1] thumb-gradient-1 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8">
                <span className="inline-flex w-fit items-center gap-1 px-2.5 py-1 rounded-full bg-cool-600/90 text-[11px] font-semibold text-white mb-2">
                  <Sparkles className="w-3 h-3" /> Featured
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow">{featured.name}</h2>
                <p className="text-sm text-slate-300 mt-1">by {featured.creator}</p>
                <span className="mt-4 inline-flex w-fit items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-surface-950 font-semibold text-sm group-hover:bg-cool-100 transition">
                  Play now
                </span>
              </div>
            </div>
          </Link>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-700 p-8 sm:p-12 text-center mb-6 bg-surface-900/50">
            <Sparkles className="w-10 h-10 text-cool-400 mx-auto mb-3" />
            <h2 className="text-xl font-bold mb-2">Your world starts here</h2>
            <p className="text-slate-400 text-sm mb-5 max-w-md mx-auto">
              Create a game in Studio, publish it, and it will show up for everyone to play.
            </p>
            <Link
              href="/studio"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cool-600 hover:bg-cool-500 text-white font-semibold"
            >
              <Plus className="w-5 h-5" /> Open Studio
            </Link>
          </div>
        )}

        {/* Categories */}
        <div className="mb-6">
          <CategoryChips />
        </div>

        {/* Quick create bar */}
        <Link
          href="/studio"
          className="mb-8 flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-cool-600/20 to-violet-600/10 border border-cool-600/25 hover:border-cool-500/40 transition"
        >
          <div className="w-11 h-11 rounded-xl bg-cool-600 flex items-center justify-center shrink-0">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm">Create a game</p>
            <p className="text-xs text-slate-400">Build in Studio · Publish · Share</p>
          </div>
        </Link>

        {cards.length > 0 && (
          <>
            <SectionRow title="Popular right now" href="/main/games">
              {popular.slice(0, 12).map((g) => (
                <GameCard key={g.id} game={g} size="sm" />
              ))}
            </SectionRow>

            <SectionRow title="Recently published" href="/main/discover">
              {newest.slice(0, 12).map((g) => (
                <GameCard key={`n-${g.id}`} game={g} size="sm" />
              ))}
            </SectionRow>

            <section className="mb-4">
              <h2 className="text-lg sm:text-xl font-bold mb-3">All experiences</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {cards.map((g) => (
                  <GameCard key={`g-${g.id}`} game={g} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
