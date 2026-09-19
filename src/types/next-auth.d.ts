import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      username: string;
      coolbloxId: string;
      coolCoins: number;
      avatarUrl?: string | null;
    };
  }

  interface User {
    username: string;
    coolbloxId: string;
    coolCoins: number;
    avatarUrl?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    coolbloxId: string;
    coolCoins: number;
    avatarUrl?: string | null;
  }
}
