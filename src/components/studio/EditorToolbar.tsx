"use client";

import { useEditorStore } from "@/store/editorStore";
import {
  MousePointer2, Move, RotateCw, Maximize2, Plus, Trash2,
  Copy, Save, Play, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PublishButton } from "./PublishButton";

export function EditorToolbar({
  onSave,
  onPlay
}: {
  onSave: () => void;
  onPlay: () => void;
}) {
  const {
    tool, setTool, selectedIds, deleteSelected, duplicateSelected,
    addObject, isDirty, isSaving, projectName
  } = useEditorStore();

  const tools = [
    { id: "select" as const, icon: MousePointer2, label: "Select (Q)" },
    { id: "move" as const, icon: Move, label: "Move (W)" },
    { id: "rotate" as const, icon: RotateCw, label: "Rotate (E)" },
    { id: "scale" as const, icon: Maximize2, label: "Scale (R)" }
  ];

  const addPart = () => {
    const id = `part-${Date.now()}`;
    addObject({
      id,
      name: "Part",
      type: "part",
      position: [0, 1, 0],
      rotation: [0, 0, 0],
      scale: [2, 2, 2],
      color: "#94a3b8",
      material: "smooth",
      anchored: true,
      collision: true,
      visible: true
    });
  };

  return (
    <div className="h-12 bg-surface-900 border-b border-slate-800 flex items-center px-3 gap-2">
      <span className="text-sm font-medium truncate max-w-[140px] hidden sm:block">{projectName}</span>
      {isDirty && <span className="text-xs text-amber-400">• Unsaved</span>}

      <div className="w-px h-6 bg-slate-700 mx-1" />

      <div className="flex items-center gap-0.5 bg-surface-800 rounded-lg p-0.5">
        {tools.map((t) => (
          <button
            key={t.id}
            onClick={() => setTool(t.id)}
            title={t.label}
            className={cn(
              "p-2 rounded-md transition",
              tool === t.id ? "bg-cool-600 text-white" : "text-slate-400 hover:text-white hover:bg-surface-700"
            )}
          >
            <t.icon className="w-4 h-4" />
          </button>
        ))}
      </div>

      <div className="w-px h-6 bg-slate-700 mx-1" />

      <button onClick={addPart} className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-surface-800" title="Add Part">
        <Plus className="w-4 h-4" />
      </button>
      <button
        onClick={duplicateSelected}
        disabled={selectedIds.length === 0}
        className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-surface-800 disabled:opacity-40"
        title="Duplicate"
      >
        <Copy className="w-4 h-4" />
      </button>
      <button
        onClick={deleteSelected}
        disabled={selectedIds.length === 0}
        className="p-2 rounded-md text-slate-400 hover:text-red-400 hover:bg-surface-800 disabled:opacity-40"
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <div className="flex-1" />

      <button
        onClick={onSave}
        disabled={isSaving || !isDirty}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-800 hover:bg-surface-700 text-sm disabled:opacity-50"
      >
        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Save
      </button>

      <PublishButton />

      <button
        onClick={onPlay}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm"
      >
        <Play className="w-4 h-4" /> Test
      </button>
    </div>
  );
}
