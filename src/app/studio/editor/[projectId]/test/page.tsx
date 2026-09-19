"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";

interface SceneObject {
  id: string;
  name: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
  visible: boolean;
}

export default function TestPlayPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  const [scene, setScene] = useState<{ objects: SceneObject[]; environment?: any } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/projects/${projectId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.project?.sceneData) setScene(data.project.sceneData);
        else setError("No scene data");
      })
      .catch(() => setError("Failed to load project"));
  }, [projectId]);

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-surface-950 text-red-400">
        {error}
        <Link href={`/studio/editor/${projectId}`} className="ml-4 text-cool-400">Back to Editor</Link>
      </div>
    );
  }

  if (!scene) {
    return (
      <div className="h-screen flex items-center justify-center bg-surface-950 text-slate-400">
        Loading test session...
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-black">
      <div className="h-12 bg-surface-900/90 border-b border-slate-800 flex items-center px-4 gap-4 z-10">
        <Link
          href={`/studio/editor/${projectId}`}
          className="flex items-center gap-2 text-sm text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Exit Test
        </Link>
        <span className="text-xs text-emerald-400 font-medium">TEST MODE</span>
        <button
          onClick={() => router.refresh()}
          className="ml-auto flex items-center gap-1.5 text-sm text-slate-400 hover:text-white"
        >
          <RotateCcw className="w-4 h-4" /> Restart
        </button>
      </div>

      <div className="flex-1">
        <Canvas camera={{ position: [12, 10, 12], fov: 50 }} shadows>
          <color attach="background" args={[scene.environment?.skyColor || "#87ceeb"]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
          <Grid infiniteGrid cellSize={1} sectionSize={5} fadeDistance={60} />

          {scene.objects
            .filter((o) => o.visible !== false)
            .map((obj) => (
              <mesh
                key={obj.id}
                position={obj.position}
                rotation={obj.rotation}
                scale={obj.scale}
                castShadow
                receiveShadow
              >
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color={obj.color || "#94a3b8"} />
              </mesh>
            ))}

          {/* Simple player representation */}
          <mesh position={[0, 1.5, 0]}>
            <capsuleGeometry args={[0.4, 1.2, 4, 8]} />
            <meshStandardMaterial color="#0ea5e9" />
          </mesh>

          <OrbitControls makeDefault />
        </Canvas>
      </div>
    </div>
  );
}
