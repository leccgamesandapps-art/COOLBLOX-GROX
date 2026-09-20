"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Grid } from "@react-three/drei";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

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

function PlayerController() {
  const { camera } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const pos = useRef(new THREE.Vector3(0, 1.6, 8));
  const yaw = useRef(0);
  const pitch = useRef(0);
  const pointerLocked = useRef(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
    };
    const up = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };
    const move = (e: MouseEvent) => {
      if (!pointerLocked.current) return;
      yaw.current -= e.movementX * 0.002;
      pitch.current -= e.movementY * 0.002;
      pitch.current = Math.max(-1.2, Math.min(1.2, pitch.current));
    };
    const lock = () => {
      pointerLocked.current = document.pointerLockElement === document.body;
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("mousemove", move);
    document.addEventListener("pointerlockchange", lock);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("mousemove", move);
      document.removeEventListener("pointerlockchange", lock);
    };
  }, []);

  useFrame((_, dt) => {
    const speed = keys.current["ShiftLeft"] ? 14 : 7;
    const forward = new THREE.Vector3(-Math.sin(yaw.current), 0, -Math.cos(yaw.current));
    const right = new THREE.Vector3(Math.cos(yaw.current), 0, -Math.sin(yaw.current));

    if (keys.current["KeyW"] || keys.current["ArrowUp"]) pos.current.addScaledVector(forward, speed * dt);
    if (keys.current["KeyS"] || keys.current["ArrowDown"]) pos.current.addScaledVector(forward, -speed * dt);
    if (keys.current["KeyA"] || keys.current["ArrowLeft"]) pos.current.addScaledVector(right, -speed * dt);
    if (keys.current["KeyD"] || keys.current["ArrowRight"]) pos.current.addScaledVector(right, speed * dt);

    pos.current.y = 1.6;

    camera.position.copy(pos.current);
    camera.rotation.order = "YXZ";
    camera.rotation.y = yaw.current;
    camera.rotation.x = pitch.current;
  });

  return (
    <mesh position={[pos.current.x, 0.9, pos.current.z]}>
      <capsuleGeometry args={[0.35, 0.9, 4, 8]} />
      <meshStandardMaterial color="#0ea5e9" />
    </mesh>
  );
}

export function GamePlayer({ sceneData, gameName, creator }: Props) {
  const [hint, setHint] = useState("Click canvas · WASD move · Mouse look · Shift sprint");

  const requestLock = () => {
    document.body.requestPointerLock?.();
    setHint("WASD move · Mouse look · Esc release · Shift sprint");
  };

  return (
    <div className="h-screen flex flex-col bg-black">
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
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 text-xs text-white">
          <Users className="w-3.5 h-3.5" /> 1
        </div>
      </div>

      <div className="flex-1 relative" onClick={requestLock}>
        <Canvas camera={{ position: [0, 1.6, 8], fov: 70 }} shadows className="w-full h-full">
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

          <PlayerController />
        </Canvas>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full bg-black/50 text-xs text-slate-300 pointer-events-none">
        {hint}
      </div>
    </div>
  );
}
