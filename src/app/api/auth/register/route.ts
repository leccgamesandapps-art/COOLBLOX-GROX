import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { generateCoolBloxId } from "@/lib/utils";
import { createId } from "@/lib/ids";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, email, password, displayName } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Username, email and password are required" },
        { status: 400 }
      );
    }

    if (username.length < 3 || username.length > 20) {
      return NextResponse.json(
        { error: "Username must be 3-20 characters" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Ensure tables exist (safe if already created)
    try {
      await prisma.user.findFirst({ take: 1 });
    } catch {
      return NextResponse.json(
        {
          error: "Database not initialized. Open /api/setup/db once, then try again."
        },
        { status: 503 }
      );
    }

    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }]
      }
    });

    if (existing) {
      return NextResponse.json(
        {
          error:
            existing.username === username
              ? "Username already taken"
              : "Email already registered"
        },
        { status: 409 }
      );
    }

    let coolbloxId = generateCoolBloxId();
    while (await prisma.user.findUnique({ where: { coolbloxId } })) {
      coolbloxId = generateCoolBloxId();
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const now = new Date();

    const user = await prisma.user.create({
      data: {
        id: createId(),
        username,
        email,
        passwordHash,
        displayName: displayName || username,
        coolbloxId,
        coolCoins: 100,
        createdAt: now,
        updatedAt: now
      }
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        coolbloxId: user.coolbloxId,
        displayName: user.displayName
      }
    });
  } catch (error: any) {
    console.error("Register error:", error);
    const msg = error?.message || "";
    if (msg.includes("does not exist") || error?.code === "P2021") {
      return NextResponse.json(
        {
          error: "Database tables missing. Visit /api/setup/db once, then register again."
        },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
