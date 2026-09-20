import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    let userTable = false;
    try {
      await prisma.user.findFirst({ take: 1 });
      userTable = true;
    } catch {
      userTable = false;
    }
    return NextResponse.json({
      ok: true,
      database: "connected",
      userTable,
      setup: userTable ? "ready" : "run GET /api/setup/db"
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, database: "error", error: e?.message },
      { status: 500 }
    );
  }
}
