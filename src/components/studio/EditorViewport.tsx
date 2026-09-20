"use client";

import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Grid,
  GizmoHelper,
  GizmoViewport,
  TransformControls
} from "@react-three/drei";
import { useEditorStore, SceneObject } from "@/store/editorStore";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";

function PartMesh({ obj, selected }: { obj: SceneObject; selected: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { tool, updateObject, select } = useEditorStore();
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (meshRef.current && !dragging) {
      meshRef.current.position.set(...obj.position);
      meshRef.current.rotation.set(...obj.rotation);
      meshRef.current.scale.set(...obj.scale);
    }
  }, [obj.position, obj.rotation, obj.scale, dragging]);

  if (!obj.visible) return null;

  const mode =
    tool === "move" ? "translate" : tool === "rotate" ? "rotate" : tool === "scale" ? "scale" : null;

  return (
    <>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          select([obj.id]);
        }}
        onPointerDown={(e) => e.stopPropagation()}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={obj.color}
          emissive={selected ? "#0ea5e9" : "#000000"}
          emissiveIntensity={selected ? 0.2 : 0}
        />
      </mesh>

      {selected && meshRef.current && mode && (
        <TransformControls
          object={meshRef.current}
          mode={mode}
          size={0.85}
          onMouseDown={() => setDragging(true)}
          onMouseUp={() => {
            setDragging(false);
            if (!meshRef.current) return;
            const p = meshRef.current.position;
            const r = meshRef.current.rotation;
            const s = meshRef.current.scale;
            updateObject(obj.id, {
              position: [p.x, p.y, p.z],
              rotation: [r.x, r.y, r.z],
              scale: [s.x, s.y, s.z]
            });
          }}
          onObjectChange={() => {
            if (!meshRef.current) return;
            const p = meshRef.current.position;
            const r = meshRef.current.rotation;
            const s = meshRef.current.scale;
            updateObject(obj.id, {
              position: [p.x, p.y, p.z],
              rotation: [r.x, r.y, r.z],
              scale: [s.x, s.y, s.z]
            });
          }}
        />
      )}
    </>
  );
}

function SceneContent() {
  const { scene, selectedIds, select, tool } = useEditorStore();
  const transforming = selectedIds.length > 0 && tool !== "select";

  return (
    <>
      <color attach="background" args={[scene.environment.skyColor || "#87ceeb"]} />
      <ambientLight intensity={0.45} color={scene.lighting.ambient} />
      <directionalLight
        position={scene.lighting.directional.position}
        intensity={scene.lighting.directional.intensity}
        color={scene.lighting.directional.color}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      <Grid
        infiniteGrid
        cellSize={1}
        sectionSize={5}
        fadeDistance={80}
        cellColor="#334155"
        sectionColor="#475569"
      />

      {scene.objects.map((obj) => (
        <PartMesh key={obj.id} obj={obj} selected={selectedIds.includes(obj.id)} />
      ))}

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.12}
        enabled={!transforming}
        maxPolarAngle={Math.PI * 0.95}
        minDistance={2}
        maxDistance={200}
      />
      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewport />
      </GizmoHelper>

      <mesh
        position={[0, -50, 0]}
        scale={[2000, 1, 2000]}
        onClick={() => select([])}
        visible={false}
      >
        <boxGeometry />
      </mesh>
    </>
  );
}

export function EditorViewport() {
  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows
        camera={{ position: [15, 12, 15], fov: 50, near: 0.1, far: 500 }}
        gl={{ antialias: true }}
      >
        <SceneContent />
      </Canvas>
      <div className="absolute bottom-3 left-3 text-xs text-white/70 bg-black/40 px-2 py-1 rounded pointer-events-none">
        Click part → toolbar Move (W) / Rotate (E) / Scale (R) · Drag gizmo arrows
      </div>
    </div>
  );
}
