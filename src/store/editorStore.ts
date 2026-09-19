"use client";

import { create } from "zustand";

export interface SceneObject {
  id: string;
  name: string;
  type: "part" | "spawn" | "model" | "light";
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
  material: string;
  anchored: boolean;
  collision: boolean;
  visible: boolean;
}

export interface SceneData {
  objects: SceneObject[];
  lighting: {
    ambient: string;
    directional: { color: string; intensity: number; position: [number, number, number] };
  };
  environment: { skyColor: string; fog: boolean };
}

interface EditorState {
  projectId: string | null;
  projectName: string;
  scene: SceneData;
  selectedIds: string[];
  tool: "select" | "move" | "rotate" | "scale";
  isDirty: boolean;
  isSaving: boolean;
  isPlaying: boolean;

  setProject: (id: string, name: string, scene: SceneData) => void;
  setTool: (tool: EditorState["tool"]) => void;
  select: (ids: string[]) => void;
  addObject: (obj: SceneObject) => void;
  updateObject: (id: string, updates: Partial<SceneObject>) => void;
  deleteSelected: () => void;
  duplicateSelected: () => void;
  setDirty: (v: boolean) => void;
  setSaving: (v: boolean) => void;
  setPlaying: (v: boolean) => void;
}

const defaultScene: SceneData = {
  objects: [],
  lighting: {
    ambient: "#404040",
    directional: { color: "#ffffff", intensity: 1, position: [10, 20, 10] }
  },
  environment: { skyColor: "#87ceeb", fog: false }
};

export const useEditorStore = create<EditorState>((set, get) => ({
  projectId: null,
  projectName: "Untitled",
  scene: defaultScene,
  selectedIds: [],
  tool: "select",
  isDirty: false,
  isSaving: false,
  isPlaying: false,

  setProject: (id, name, scene) =>
    set({ projectId: id, projectName: name, scene, selectedIds: [], isDirty: false }),

  setTool: (tool) => set({ tool }),

  select: (ids) => set({ selectedIds: ids }),

  addObject: (obj) =>
    set((s) => ({
      scene: { ...s.scene, objects: [...s.scene.objects, obj] },
      selectedIds: [obj.id],
      isDirty: true
    })),

  updateObject: (id, updates) =>
    set((s) => ({
      scene: {
        ...s.scene,
        objects: s.scene.objects.map((o) => (o.id === id ? { ...o, ...updates } : o))
      },
      isDirty: true
    })),

  deleteSelected: () =>
    set((s) => ({
      scene: {
        ...s.scene,
        objects: s.scene.objects.filter((o) => !s.selectedIds.includes(o.id))
      },
      selectedIds: [],
      isDirty: true
    })),

  duplicateSelected: () => {
    const { scene, selectedIds } = get();
    const copies = scene.objects
      .filter((o) => selectedIds.includes(o.id))
      .map((o) => ({
        ...o,
        id: `${o.id}-copy-${Date.now()}`,
        name: `${o.name} Copy`,
        position: [o.position[0] + 2, o.position[1], o.position[2]] as [number, number, number]
      }));
    set({
      scene: { ...scene, objects: [...scene.objects, ...copies] },
      selectedIds: copies.map((c) => c.id),
      isDirty: true
    });
  },

  setDirty: (v) => set({ isDirty: v }),
  setSaving: (v) => set({ isSaving: v }),
  setPlaying: (v) => set({ isPlaying: v })
}));
