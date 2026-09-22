import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { GamePlayer } from "@/components/game/GamePlayer";

export const dynamic = "force-dynamic";

export default async function GamePlayPage({
  params
}: {
  params: Promise<{ projectId: string; gameId: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const { projectId, gameId } = await params;

  const version = await prisma.gameVersion.findFirst({
    where: {
      id: gameId,
      projectId,
      OR: [{ visibility: "public" }, { visibility: "unlisted" }]
    },
    include: {
      project: {
        include: { owner: { select: { username: true, displayName: true } } }
      }
    }
  });

  if (!version) notFound();

  return (
    <GamePlayer
      sceneData={version.sceneData as any}
      gameName={version.project.name}
      creator={version.project.owner.displayName || version.project.owner.username}
      projectId={projectId}
      gameId={gameId}
      backHref="/main/main"
      mode="play"
    />
  );
}
