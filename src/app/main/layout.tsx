import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { MainNav } from "@/components/layout/MainNav";
import { MainContent } from "@/components/layout/MainContent";

export const dynamic = "force-dynamic";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  return (
    <div className="flex min-h-screen bg-surface-950">
      <MainNav />
      <MainContent>{children}</MainContent>
    </div>
  );
}
