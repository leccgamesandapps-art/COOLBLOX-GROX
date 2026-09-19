import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const project = await prisma.project.findFirst({
    where: {
      id,
      OR: [
        { ownerId: session.user.id },
        { collaborators: { some: { userId: session.user.id } } }
      ]
    },
    include: { owner: { select: { username: true, displayName: true } } }
  });

  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ project });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const project = await prisma.project.findFirst({
    where: {
      id,
      OR: [
        { ownerId: session.user.id },
        { collaborators: { some: { userId: session.user.id, role: { in: ["owner", "editor"] } } } }
      ]
    }
  });

  if (!project) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const updated = await prisma.project.update({
    where: { id },
    data: {
      name: body.name ?? project.name,
      description: body.description ?? project.description,
      sceneData: body.sceneData ?? project.sceneData,
      settings: body.settings ?? project.settings,
      visibility: body.visibility ?? project.visibility,
      thumbnail: body.thumbnail ?? project.thumbnail,
      version: { increment: 1 }
    }
  });

  return NextResponse.json({ project: updated });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const project = await prisma.project.findFirst({
    where: { id, ownerId: session.user.id }
  });

  if (!project) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
