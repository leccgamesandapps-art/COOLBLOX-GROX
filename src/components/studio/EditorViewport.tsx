"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, GizmoHelper, GizmoViewport, TransformControls } from "@react-three/drei";
import { useEditorStore, SceneObject } from "@/store/editorStore";
import { useRef, useEffect } from "react";
import * as THREE from "three";

function PartMesh({ obj, selected }: { obj: SceneObject; selected: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { tool, updateObject, select } = useEditorStore();

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.set(...obj.position);
      meshRef.current.rotation.set(...obj.rotation);
      meshRef.current.scale.set(...obj.scale);
    }
  }, [obj.position, obj.rotation, obj.scale]);

  if (!obj.visible) return null;

  return (
    <>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          select([obj.id]);
        }}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={obj.color}
          emissive={selected ? "#0ea5e9" : "#000000"}
          emissiveIntensity={selected ? 0.15 : 0}
        />
      </mesh>

      {selected && meshRef.current && tool !== "select" && (
        <TransformControls
          object={meshRef.current}
          mode={tool === "move" ? "translate" : tool === "rotate" ? "rotate" : "scale"}
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
  const { scene, selectedIds, select } = useEditorStore();

  return (
    <>
      <color attach="background" args={[scene.environment.skyColor || "#87ceeb"]} />
      <ambientLight intensity={0.4} color={scene.lighting.ambient} />
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

      <OrbitControls makeDefault enableDamping dampingFactor={0.1} />
      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewport />
      </GizmoHelper>

      {/* Click empty space to deselect */}
      <mesh
        position={[0, -100, 0]}
        scale={[1000, 1, 1000]}
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
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [15, 12, 15], fov: 50, near: 0.1, far: 500 }}
        gl={{ antialias: true }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}
