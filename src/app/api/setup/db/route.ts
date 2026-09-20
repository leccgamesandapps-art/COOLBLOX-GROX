import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * One-time database setup. Creates all tables if missing.
 * Safe to call multiple times (IF NOT EXISTS).
 * GET /api/setup/db
 */
export async function GET() {
  try {
    await prisma.$executeRawUnsafe(`
CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT PRIMARY KEY,
  "coolbloxId" TEXT NOT NULL UNIQUE,
  "username" TEXT NOT NULL UNIQUE,
  "email" TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL,
  "displayName" TEXT,
  "avatarUrl" TEXT,
  "bio" TEXT,
  "coolCoins" INTEGER NOT NULL DEFAULT 100,
  "isPremium" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`);

    await prisma.$executeRawUnsafe(`
CREATE TABLE IF NOT EXISTS "Session" (
  "id" TEXT PRIMARY KEY,
  "sessionToken" TEXT NOT NULL UNIQUE,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "expires" TIMESTAMP(3) NOT NULL
);
`);

    await prisma.$executeRawUnsafe(`
CREATE TABLE IF NOT EXISTS "Project" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "thumbnail" TEXT,
  "ownerId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "visibility" TEXT NOT NULL DEFAULT 'private',
  "version" INTEGER NOT NULL DEFAULT 1,
  "sceneData" JSONB,
  "settings" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "publishedAt" TIMESTAMP(3)
);
`);

    await prisma.$executeRawUnsafe(`
CREATE TABLE IF NOT EXISTS "ProjectCollaborator" (
  "id" TEXT PRIMARY KEY,
  "projectId" TEXT NOT NULL REFERENCES "Project"("id") ON DELETE CASCADE,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "role" TEXT NOT NULL DEFAULT 'editor',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("projectId", "userId")
);
`);

    await prisma.$executeRawUnsafe(`
CREATE TABLE IF NOT EXISTS "GameVersion" (
  "id" TEXT PRIMARY KEY,
  "projectId" TEXT NOT NULL REFERENCES "Project"("id") ON DELETE CASCADE,
  "version" INTEGER NOT NULL,
  "sceneData" JSONB NOT NULL,
  "thumbnail" TEXT,
  "description" TEXT,
  "visibility" TEXT NOT NULL DEFAULT 'public',
  "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "isLatest" BOOLEAN NOT NULL DEFAULT true
);
`);

    await prisma.$executeRawUnsafe(`
CREATE TABLE IF NOT EXISTS "Friendship" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "friendId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("userId", "friendId")
);
`);

    await prisma.$executeRawUnsafe(`
CREATE TABLE IF NOT EXISTS "Message" (
  "id" TEXT PRIMARY KEY,
  "senderId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "receiverId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "content" TEXT NOT NULL,
  "read" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`);

    await prisma.$executeRawUnsafe(`
CREATE TABLE IF NOT EXISTS "Notification" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "type" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "body" TEXT,
  "data" JSONB,
  "read" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`);

    await prisma.$executeRawUnsafe(`
CREATE TABLE IF NOT EXISTS "Favorite" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "projectId" TEXT NOT NULL REFERENCES "Project"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("userId", "projectId")
);
`);

    await prisma.$executeRawUnsafe(`
CREATE TABLE IF NOT EXISTS "Like" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "gameVersionId" TEXT NOT NULL REFERENCES "GameVersion"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("userId", "gameVersionId")
);
`);

    await prisma.$executeRawUnsafe(`
CREATE TABLE IF NOT EXISTS "InventoryItem" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "itemType" TEXT NOT NULL,
  "itemId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "equipped" BOOLEAN NOT NULL DEFAULT false,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`);

    await prisma.$executeRawUnsafe(`
CREATE TABLE IF NOT EXISTS "Transaction" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "amount" INTEGER NOT NULL,
  "type" TEXT NOT NULL,
  "description" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`);

    // Indexes
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "User_username_idx" ON "User"("username");`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "User_coolbloxId_idx" ON "User"("coolbloxId");`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Session_userId_idx" ON "Session"("userId");`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Project_ownerId_idx" ON "Project"("ownerId");`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Project_visibility_idx" ON "Project"("visibility");`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "GameVersion_projectId_idx" ON "GameVersion"("projectId");`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "GameVersion_isLatest_idx" ON "GameVersion"("isLatest");`);

    // Verify
    const tables = await prisma.$queryRawUnsafe<
      { tablename: string }[]
    >(`SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;`);

    return NextResponse.json({
      success: true,
      message: "Database schema is ready",
      tables: tables.map((t) => t.tablename)
    });
  } catch (error: any) {
    console.error("DB setup error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Database setup failed",
        hint: "Check DATABASE_URL in Vercel env points to the correct Neon database"
      },
      { status: 500 }
    );
  }
}
