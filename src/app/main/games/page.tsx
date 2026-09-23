import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Gamepad2 } from "lucide-react";
import { GameCard, type GameCardData } from "@/components/ui/GameCard";

export const dynamic = "force-dynamic";

export default async function GamesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  let games: any[] = [];
  try {
    games = await prisma.gameVersion.findMany({
      where: { isLatest: true, visibility: "public" },
      include: {
        project: { include: { owner: { select: { username: true, displayName: true } } } },
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
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
          <Gamepad2 className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Games</h1>
          <p className="text-sm text-slate-400">{cards.length} public experiences</p>
        </div>
      </div>

      {cards.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700 p-12 text-center text-slate-400">
          No published games yet. Create one in Studio and hit Publish.
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
