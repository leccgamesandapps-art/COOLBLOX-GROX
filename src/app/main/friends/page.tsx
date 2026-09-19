import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Users } from "lucide-react";

export default async function FriendsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/index");

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <Users className="w-6 h-6 text-cool-400" /> Friends
      </h1>
      <div className="rounded-2xl border border-dashed border-slate-700 p-12 text-center text-slate-400">
        <p>Friend requests and following will appear here.</p>
        <p className="text-sm mt-2">Social system foundation is ready in the database.</p>
      </div>
    </div>
  );
}
