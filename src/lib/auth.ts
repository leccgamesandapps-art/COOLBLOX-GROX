import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60
  },
  pages: {
    signIn: "/",
    error: "/"
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const user = await prisma.user.findFirst({
          where: {
            OR: [{ username: credentials.username }, { email: credentials.username }]
          }
        });

        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.displayName || user.username,
          email: user.email,
          username: user.username,
          coolbloxId: user.coolbloxId,
          coolCoins: user.coolCoins,
          avatarUrl: user.avatarUrl
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = (user as any).username;
        token.coolbloxId = (user as any).coolbloxId;
        token.coolCoins = (user as any).coolCoins;
        token.avatarUrl = (user as any).avatarUrl;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).username = token.username;
        (session.user as any).coolbloxId = token.coolbloxId;
        (session.user as any).coolCoins = token.coolCoins;
        (session.user as any).avatarUrl = token.avatarUrl;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
};
