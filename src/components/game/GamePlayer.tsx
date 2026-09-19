"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import Link from "next/link";
import { ArrowLeft, Users, MessageSquare } from "lucide-react";

interface Props {
  sceneData: {
    objects: Array<{
      id: string;
      position: [number, number, number];
      rotation: [number, number, number];
      scale: [number, number, number];
      color: string;
      visible?: boolean;
    }>;
    environment?: { skyColor?: string };
  };
  gameName: string;
  creator: string;
  projectId: string;
  gameId: string;
}

export function GamePlayer({ sceneData, gameName, creator }: Props) {
  return (
    <div className="h-screen flex flex-col bg-black">
      {/* Top HUD */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/70 to-transparent">
        <div className="flex items-center gap-3">
          <Link href="/main/main" className="p-2 rounded-lg bg-black/40 hover:bg-black/60 text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-semibold text-white text-sm">{gameName}</h1>
            <p className="text-xs text-slate-300">by {creator}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 text-xs text-white">
            <Users className="w-3.5 h-3.5" /> 1
          </div>
          <button className="p-2 rounded-lg bg-black/40 hover:bg-black/60 text-white">
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>
      </div>

      <Canvas camera={{ position: [12, 10, 12], fov: 50 }} shadows className="flex-1">
        <color attach="background" args={[sceneData.environment?.skyColor || "#87ceeb"]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
        <Grid infiniteGrid cellSize={1} sectionSize={5} fadeDistance={60} />

        {sceneData.objects
          ?.filter((o) => o.visible !== false)
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

        {/* Player avatar */}
        <mesh position={[0, 1.5, 0]}>
          <capsuleGeometry args={[0.4, 1.2, 4, 8]} />
          <meshStandardMaterial color="#0ea5e9" />
        </mesh>

        <OrbitControls makeDefault />
      </Canvas>

      {/* Bottom hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full bg-black/50 text-xs text-slate-300">
        Drag to look around • Scroll to zoom
      </div>
    </div>
  );
}
