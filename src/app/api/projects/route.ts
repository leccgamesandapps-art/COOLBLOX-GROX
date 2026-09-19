import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const BASEPLATE_SCENE = {
  objects: [
    {
      id: "baseplate",
      name: "Baseplate",
      type: "part",
      position: [0, -0.5, 0],
      rotation: [0, 0, 0],
      scale: [50, 1, 50],
      color: "#4a5568",
      material: "smooth",
      anchored: true,
      collision: true,
      visible: true
    },
    {
      id: "spawn",
      name: "Spawn",
      type: "spawn",
      position: [0, 1, 0],
      rotation: [0, 0, 0],
      scale: [2, 0.2, 2],
      color: "#22c55e",
      material: "neon",
      anchored: true,
      collision: false,
      visible: true
    }
  ],
  lighting: {
    ambient: "#404040",
    directional: { color: "#ffffff", intensity: 1, position: [10, 20, 10] }
  },
  environment: { skyColor: "#87ceeb", fog: false }
};

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const projects = await prisma.project.findMany({
    where: { ownerId: session.user.id },
    orderBy: { updatedAt: "desc" }
  });

  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const name = body.name || "Untitled Project";
    const template = body.template || "baseplate";

    const sceneData = template === "baseplate" ? BASEPLATE_SCENE : BASEPLATE_SCENE;

    const project = await prisma.project.create({
      data: {
        name,
        ownerId: session.user.id,
        visibility: "private",
        sceneData,
        settings: { maxPlayers: 20, genre: "sandbox" }
      }
    });

    return NextResponse.json({ project });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
