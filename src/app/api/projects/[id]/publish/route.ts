import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const project = await prisma.project.findFirst({
    where: { id, ownerId: session.user.id }
  });

  if (!project) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!project.sceneData) {
    return NextResponse.json({ error: "Project has no scene data. Save first." }, { status: 400 });
  }

  // Mark previous versions as not latest
  await prisma.gameVersion.updateMany({
    where: { projectId: id, isLatest: true },
    data: { isLatest: false }
  });

  const version = await prisma.gameVersion.create({
    data: {
      projectId: id,
      version: project.version,
      sceneData: project.sceneData,
      thumbnail: project.thumbnail,
      description: project.description || body.description,
      visibility: body.visibility || project.visibility || "public",
      isLatest: true
    }
  });

  await prisma.project.update({
    where: { id },
    data: {
      publishedAt: new Date(),
      visibility: body.visibility || project.visibility
    }
  });

  return NextResponse.json({ version, success: true });
}
