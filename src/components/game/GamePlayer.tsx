"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Grid } from "@react-three/drei";
import Link from "next/link";
import { ArrowLeft, Users, Maximize2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gameInput } from "./inputStore";
import { MobileControls } from "./MobileControls";

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
  projectId?: string;
  gameId?: string;
  backHref?: string;
  mode?: "play" | "test";
}

function PlayerController() {
  const { camera } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const pos = useRef(new THREE.Vector3(0, 1.6, 8));
  const yaw = useRef(0);
  const pitch = useRef(0);
  const pointerLocked = useRef(false);
  const bodyRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    gameInput.reset();

    const down = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
      if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
        gameInput.setMove({ sprint: true });
      }
    };
    const up = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
      if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
        gameInput.setMove({ sprint: false });
      }
    };
    const move = (e: MouseEvent) => {
      if (!pointerLocked.current) return;
      gameInput.addLook(e.movementX, e.movementY);
    };
    const lock = () => {
      pointerLocked.current = document.pointerLockElement != null;
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
      gameInput.reset();
    };
  }, []);

  useFrame((_, dt) => {
    const look = gameInput.consumeLook();
    yaw.current -= look.dx * 0.0025;
    pitch.current -= look.dy * 0.0025;
    pitch.current = Math.max(-1.25, Math.min(1.25, pitch.current));

    // Keyboard
    let kx = 0;
    let ky = 0;
    if (keys.current["KeyW"] || keys.current["ArrowUp"]) ky += 1;
    if (keys.current["KeyS"] || keys.current["ArrowDown"]) ky -= 1;
    if (keys.current["KeyA"] || keys.current["ArrowLeft"]) kx -= 1;
    if (keys.current["KeyD"] || keys.current["ArrowRight"]) kx += 1;

    // Touch joystick
    const touch = gameInput.getMove();
    let mx = kx + touch.x;
    let my = ky + touch.y;
    const mag = Math.hypot(mx, my);
    if (mag > 1) {
      mx /= mag;
      my /= mag;
    }

    const sprint = keys.current["ShiftLeft"] || keys.current["ShiftRight"] || touch.sprint;
    const speed = sprint ? 14 : 7;

    const forward = new THREE.Vector3(-Math.sin(yaw.current), 0, -Math.cos(yaw.current));
    const right = new THREE.Vector3(Math.cos(yaw.current), 0, -Math.sin(yaw.current));

    pos.current.addScaledVector(forward, my * speed * dt);
    pos.current.addScaledVector(right, mx * speed * dt);
    pos.current.y = 1.6;

    camera.position.copy(pos.current);
    camera.rotation.order = "YXZ";
    camera.rotation.y = yaw.current;
    camera.rotation.x = pitch.current;

    if (bodyRef.current) {
      bodyRef.current.position.set(pos.current.x, 0.9, pos.current.z);
      bodyRef.current.rotation.y = yaw.current;
    }
  });

  return (
    <mesh ref={bodyRef} position={[0, 0.9, 8]}>
      <capsuleGeometry args={[0.35, 0.9, 4, 8]} />
      <meshStandardMaterial color="#0ea5e9" />
    </mesh>
  );
}

export function GamePlayer({
  sceneData,
  gameName,
  creator,
  backHref = "/main/main",
  mode = "play"
}: Props) {
  const [isTouch, setIsTouch] = useState(false);
  const [hint, setHint] = useState("");
  const shellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const coarse =
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(max-width: 900px)").matches;
    setIsTouch(coarse);
    setHint(
      coarse
        ? "Left stick move · Right pad look · RUN to sprint"
        : "Click to capture mouse · WASD move · Mouse look · Shift sprint"
    );
  }, []);

  const onCanvasActivate = () => {
    if (!isTouch) {
      shellRef.current?.requestPointerLock?.() || document.body.requestPointerLock?.();
      setHint("WASD · Mouse look · Esc release · Shift sprint");
    }
  };

  const goFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await shellRef.current?.requestFullscreen?.();
      } else {
        await document.exitFullscreen?.();
      }
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      ref={shellRef}
      className="h-[100dvh] w-full flex flex-col bg-black overflow-hidden touch-none"
      style={{ WebkitTouchCallout: "none" }}
    >
      {/* HUD */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-b from-black/80 to-transparent safe-top">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link
            href={backHref}
            className="p-2.5 sm:p-2 rounded-xl bg-black/50 hover:bg-black/70 text-white shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="font-semibold text-white text-sm truncate">{gameName}</h1>
            <p className="text-[11px] text-slate-300 truncate">
              {mode === "test" ? "TEST MODE · " : ""}by {creator}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 text-xs text-white">
            <Users className="w-3.5 h-3.5" /> 1
          </div>
          <button
            type="button"
            onClick={goFullscreen}
            className="p-2.5 rounded-xl bg-black/50 text-white"
            title="Fullscreen"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 3D */}
      <div className="flex-1 relative min-h-0" onClick={onCanvasActivate}>
        <Canvas
          camera={{ position: [0, 1.6, 8], fov: 70, near: 0.1, far: 500 }}
          shadows
          className="w-full h-full"
          dpr={[1, 1.5]}
          gl={{ antialias: true, powerPreference: "high-performance" }}
        >
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

        <MobileControls />
      </div>

      {!isTouch && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full bg-black/50 text-xs text-slate-300 pointer-events-none max-w-[90%] text-center">
          {hint}
        </div>
      )}
    </div>
  );
}
