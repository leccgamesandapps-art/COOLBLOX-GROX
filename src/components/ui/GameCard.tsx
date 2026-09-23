import Link from "next/link";
import { Play, Heart, Users } from "lucide-react";

const GRADIENTS = [
  "thumb-gradient-1",
  "thumb-gradient-2",
  "thumb-gradient-3",
  "thumb-gradient-4",
  "thumb-gradient-5"
];

export type GameCardData = {
  id: string;
  projectId: string;
  name: string;
  creator: string;
  likes?: number;
  thumbnail?: string | null;
  playersOnline?: number;
};

export function GameCard({
  game,
  size = "md"
}: {
  game: GameCardData;
  size?: "sm" | "md" | "lg";
}) {
  const grad = GRADIENTS[Math.abs(hash(game.id)) % GRADIENTS.length];
  const width =
    size === "lg" ? "w-[280px] sm:w-[320px]" : size === "sm" ? "w-[140px]" : "w-full";

  return (
    <Link
      href={`/main/game/${game.projectId}/${game.id}`}
      className={`group shrink-0 ${width} rounded-2xl bg-surface-800/80 border border-slate-700/80 overflow-hidden card-shine hover:border-cool-500/40 hover:shadow-lg hover:shadow-cool-600/10 transition-all duration-200 active:scale-[0.98]`}
    >
      <div className={`relative aspect-[16/10] ${grad}`}>
        {game.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={game.thumbnail} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-black/25 backdrop-blur flex items-center justify-center group-hover:scale-110 transition">
              <Play className="w-7 h-7 text-white fill-white/20" />
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 text-[10px] text-white backdrop-blur">
            <Users className="w-3 h-3 text-emerald-400" />
            {game.playersOnline ?? Math.max(1, (game.likes ?? 0) + 1)}
          </span>
          <span className="opacity-0 group-hover:opacity-100 transition px-2.5 py-1 rounded-full bg-cool-600 text-[11px] font-semibold text-white flex items-center gap-1">
            <Play className="w-3 h-3 fill-white" /> Play
          </span>
        </div>
      </div>
      <div className="p-2.5 sm:p-3">
        <h3 className="font-semibold text-sm truncate text-white">{game.name}</h3>
        <p className="text-[11px] text-slate-400 truncate mt-0.5">by {game.creator}</p>
        <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-0.5">
            <Heart className="w-3 h-3 text-rose-400/80" /> {game.likes ?? 0}
          </span>
        </div>
      </div>
    </Link>
  );
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

export function GameCardSkeleton() {
  return (
    <div className="rounded-2xl bg-surface-800 border border-slate-800 overflow-hidden animate-pulse">
      <div className="aspect-[16/10] bg-surface-900" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-slate-700/50 rounded w-3/4" />
        <div className="h-3 bg-slate-700/30 rounded w-1/2" />
      </div>
    </div>
  );
}
