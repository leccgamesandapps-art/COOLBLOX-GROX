"use client";

import { useState } from "react";
import { useEditorStore } from "@/store/editorStore";
import { Upload, Loader2, Check } from "lucide-react";

export function PublishButton() {
  const { projectId, isDirty } = useEditorStore();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const publish = async () => {
    if (!projectId) return;
    if (isDirty) {
      alert("Save your project first before publishing.");
      return;
    }
    setLoading(true);
    setDone(false);
    try {
      const res = await fetch(`/api/projects/${projectId}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibility: "public" })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Publish failed");
        return;
      }
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    } catch {
      alert("Publish failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={publish}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : done ? (
        <Check className="w-4 h-4" />
      ) : (
        <Upload className="w-4 h-4" />
      )}
      {done ? "Published!" : "Publish"}
    </button>
  );
}
