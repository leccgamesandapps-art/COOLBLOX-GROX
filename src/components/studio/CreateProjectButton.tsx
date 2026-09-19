"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";

export function CreateProjectButton({ large }: { large?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const create = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Untitled Project",
          template: "baseplate"
        })
      });
      const data = await res.json();
      if (res.ok && data.project) {
        router.push(`/studio/editor/${data.project.id}`);
      } else {
        alert(data.error || "Failed to create project");
      }
    } catch {
      alert("Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={create}
      disabled={loading}
      className={`inline-flex items-center gap-2 rounded-xl bg-cool-600 hover:bg-cool-500 disabled:opacity-60 text-white font-medium transition ${
        large ? "px-6 py-3 text-base" : "px-4 py-2 text-sm"
      }`}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
      New Project
    </button>
  );
}
