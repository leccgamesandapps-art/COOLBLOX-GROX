import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Play, Heart } from "lucide-react";

export default async function GamesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/index");

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

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Games</h1>
      {games.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700 p-12 text-center text-slate-400">
          No published games yet. Create one in Studio and hit Publish.
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
