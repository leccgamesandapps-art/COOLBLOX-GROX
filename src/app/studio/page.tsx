import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, FolderOpen, Clock, PenTool } from "lucide-react";
import { CreateProjectButton } from "@/components/studio/CreateProjectButton";

async function getUserProjects(userId: string) {
  try {
    return await prisma.project.findMany({
      where: { ownerId: userId },
      orderBy: { updatedAt: "desc" },
      take: 50
    });
  } catch {
    return [];
  }
}

export default async function StudioDashboard() {
  const session = await getServerSession(authOptions);
  const projects = await getUserProjects(session!.user.id);

  return (
    <div className="min-h-screen bg-surface-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-surface-900/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/main/main" className="text-slate-400 hover:text-white text-sm">← Main</Link>
            <div className="w-px h-5 bg-slate-700" />
            <div className="flex items-center gap-2">
              <PenTool className="w-5 h-5 text-cool-400" />
              <h1 className="font-bold text-lg">COOLBLOX Studio</h1>
            </div>
          </div>
          <CreateProjectButton />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-cool-400" /> My Projects
          </h2>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 p-16 text-center">
            <PenTool className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
            <p className="text-slate-400 mb-6">Create your first experience and start building.</p>
            <CreateProjectButton large />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {projects.map((p) => (
              <Link
                key={p.id}
                href={`/studio/editor/${p.id}`}
                className="group rounded-2xl bg-surface-800 border border-slate-700 overflow-hidden hover:border-cool-500/50 transition"
              >
                <div className="aspect-video bg-surface-900 flex items-center justify-center">
                  {p.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.thumbnail} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <PenTool className="w-10 h-10 text-slate-600 group-hover:text-cool-500 transition" />
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-semibold truncate">{p.name}</h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(p.updatedAt).toLocaleDateString()}
                    <span className="px-1.5 py-0.5 rounded bg-surface-900 capitalize">{p.visibility}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
