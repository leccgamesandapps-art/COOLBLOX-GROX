"use client";

import { useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useEditorStore } from "@/store/editorStore";
import { EditorViewport } from "@/components/studio/EditorViewport";
import { EditorToolbar } from "@/components/studio/EditorToolbar";
import { ExplorerPanel } from "@/components/studio/ExplorerPanel";
import { PropertiesPanel } from "@/components/studio/PropertiesPanel";
import Link from "next/link";

export default function StudioEditorPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const { setProject, scene, isDirty, setSaving, setDirty, projectName } = useEditorStore();

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/projects/${projectId}`);
      if (!res.ok) {
        router.push("/studio");
        return;
      }
      const data = await res.json();
      const sceneData = data.project.sceneData || {
        objects: [],
        lighting: { ambient: "#404040", directional: { color: "#ffffff", intensity: 1, position: [10, 20, 10] } },
        environment: { skyColor: "#87ceeb", fog: false }
      };
      setProject(data.project.id, data.project.name, sceneData);
    }
    load();
  }, [projectId, setProject, router]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sceneData: scene, name: projectName })
      });
      if (res.ok) setDirty(false);
      else alert("Save failed");
    } catch {
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  }, [projectId, scene, projectName, setSaving, setDirty]);

  const handlePlay = () => {
    // Save first then go to test mode
    handleSave().then(() => {
      router.push(`/studio/editor/${projectId}/test`);
    });
  };

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "q" || e.key === "Q") useEditorStore.getState().setTool("select");
      if (e.key === "w" || e.key === "W") useEditorStore.getState().setTool("move");
      if (e.key === "e" || e.key === "E") useEditorStore.getState().setTool("rotate");
      if (e.key === "r" || e.key === "R") useEditorStore.getState().setTool("scale");
      if (e.key === "Delete" || e.key === "Backspace") useEditorStore.getState().deleteSelected();
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleSave]);

  return (
    <div className="h-screen flex flex-col bg-surface-950 overflow-hidden">
      {/* Top bar */}
      <div className="h-10 bg-surface-900 border-b border-slate-800 flex items-center px-3 gap-3 shrink-0">
        <Link href="/studio" className="text-xs text-slate-400 hover:text-white">← Studio</Link>
        <span className="text-xs text-slate-600">|</span>
        <span className="text-xs font-medium">{projectName}</span>
      </div>

      <EditorToolbar onSave={handleSave} onPlay={handlePlay} />

      <div className="flex-1 flex overflow-hidden">
        <ExplorerPanel />
        <div className="flex-1 relative">
          <EditorViewport />
        </div>
        <PropertiesPanel />
      </div>
    </div>
  );
}
