import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { MessageSquare } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  return (
    <div className="px-4 lg:px-8 max-w-3xl mx-auto py-4 lg:py-8">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <MessageSquare className="w-6 h-6 text-violet-400" /> Messages
      </h1>
      <div className="rounded-2xl border border-dashed border-slate-700 p-12 text-center">
        <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <p className="font-medium text-slate-300">No conversations yet</p>
        <p className="text-sm text-slate-500 mt-1">
          Add friends, then start a chat. DMs use the same account system.
        </p>
      </div>
    </div>
  );
}
