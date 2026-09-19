"use client";

import { useEditorStore } from "@/store/editorStore";

export function PropertiesPanel() {
  const { scene, selectedIds, updateObject } = useEditorStore();
  const selected = scene.objects.find((o) => o.id === selectedIds[0]);

  if (!selected) {
    return (
      <div className="w-64 bg-surface-900 border-l border-slate-800 p-4 text-sm text-slate-500">
        Select an object to edit properties
      </div>
    );
  }

  const set = (key: string, value: any) => updateObject(selected.id, { [key]: value });

  const Vec3Input = ({
    label,
    value,
    onChange
  }: {
    label: string;
    value: [number, number, number];
    onChange: (v: [number, number, number]) => void;
  }) => (
    <div className="mb-3">
      <label className="text-xs text-slate-400 mb-1 block">{label}</label>
      <div className="grid grid-cols-3 gap-1">
        {(["X", "Y", "Z"] as const).map((axis, i) => (
          <input
            key={axis}
            type="number"
            step={0.1}
            value={Number(value[i].toFixed(2))}
            onChange={(e) => {
              const next = [...value] as [number, number, number];
              next[i] = parseFloat(e.target.value) || 0;
              onChange(next);
            }}
            className="w-full px-1.5 py-1 rounded bg-surface-800 border border-slate-700 text-xs text-center"
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-64 bg-surface-900 border-l border-slate-800 flex flex-col h-full overflow-y-auto">
      <div className="px-3 py-2 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
        Properties
      </div>
      <div className="p-3 space-y-1">
        <div className="mb-3">
          <label className="text-xs text-slate-400 mb-1 block">Name</label>
          <input
            value={selected.name}
            onChange={(e) => set("name", e.target.value)}
            className="w-full px-2 py-1.5 rounded-lg bg-surface-800 border border-slate-700 text-sm"
          />
        </div>

        <Vec3Input label="Position" value={selected.position} onChange={(v) => set("position", v)} />
        <Vec3Input label="Rotation (rad)" value={selected.rotation} onChange={(v) => set("rotation", v)} />
        <Vec3Input label="Scale" value={selected.scale} onChange={(v) => set("scale", v)} />

        <div className="mb-3">
          <label className="text-xs text-slate-400 mb-1 block">Color</label>
          <input
            type="color"
            value={selected.color}
            onChange={(e) => set("color", e.target.value)}
            className="w-full h-8 rounded cursor-pointer bg-transparent"
          />
        </div>

        <label className="flex items-center gap-2 text-sm py-1">
          <input
            type="checkbox"
            checked={selected.anchored}
            onChange={(e) => set("anchored", e.target.checked)}
            className="rounded"
          />
          Anchored
        </label>
        <label className="flex items-center gap-2 text-sm py-1">
          <input
            type="checkbox"
            checked={selected.collision}
            onChange={(e) => set("collision", e.target.checked)}
            className="rounded"
          />
          Collision
        </label>
        <label className="flex items-center gap-2 text-sm py-1">
          <input
            type="checkbox"\tableofcontents checked={selected.visible}
            onChange={(e) => set("visible", e.target.checked)}
            className="rounded"
          />
          Visible
        </label>
      </div>
    </div>
  );
}
