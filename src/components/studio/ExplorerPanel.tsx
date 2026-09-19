"use client";

import { useEditorStore } from "@/store/editorStore";
import { Box, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function ExplorerPanel() {
  const { scene, selectedIds, select, updateObject } = useEditorStore();

  return (
    <div className="w-56 bg-surface-900 border-r border-slate-800 flex flex-col h-full">
      <div className="px-3 py-2 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
        Explorer
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        <div className="text-xs text-slate-500 px-2 py-1">Workspace</div>
        {scene.objects.map((obj) => (
          <div
            key={obj.id}
            onClick={() => select([obj.id])}
            className={cn(
              "flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer text-sm group",
              selectedIds.includes(obj.id)
                ? "bg-cool-600/20 text-cool-300"
                : "text-slate-300 hover:bg-surface-800"
            )}
          >
            <Box className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate flex-1">{obj.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                updateObject(obj.id, { visible: !obj.visible });
              }}
              className="opacity-0 group-hover:opacity-100 p-0.5"
            >
              {obj.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-slate-500" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
