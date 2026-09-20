import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Package } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <Package className="w-6 h-6 text-amber-400" /> Inventory
      </h1>
      <div className="rounded-2xl border border-dashed border-slate-700 p-12 text-center text-slate-400">
        <p>Your items and gear will show here.</p>
        <p className="text-sm mt-2">Inventory system is connected in the database.</p>
      </div>
    </div>
  );
}
