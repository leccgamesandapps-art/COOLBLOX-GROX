import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { MainNav } from "@/components/layout/MainNav";

export const dynamic = "force-dynamic";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  return (
    <div className="flex min-h-screen bg-surface-950">
      <MainNav />
      <main className="flex-1 lg:ml-0 pt-14 pb-20 lg:pt-0 lg:pb-0 overflow-x-hidden">{children}</main>
    </div>
  );
}
