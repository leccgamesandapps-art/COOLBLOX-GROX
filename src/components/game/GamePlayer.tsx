"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Grid } from "@react-three/drei";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Users,
  Maximize2,
  Menu,
  X,
  RotateCcw,
  LogOut
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gameInput } from "./inputStore";
import { MobileControls } from "./MobileControls";
import { useSession } from "next-auth/react";

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

function PlayerController({ resetToken }: { resetToken: number }) {
  const { camera } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const pos = useRef(new THREE.Vector3(0, 1.6, 8));
  const yaw = useRef(0);
  const pitch = useRef(0);
  const pointerLocked = useRef(false);
  const bodyRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    pos.current.set(0, 1.6, 8);
    yaw.current = 0;
    pitch.current = 0;
    if (bodyRef.current) {
      bodyRef.current.position.set(0, 0.9, 8);
      bodyRef.current.rotation.y = 0;
    }
    camera.position.set(0, 1.6, 8);
    camera.rotation.set(0, 0, 0);
  }, [resetToken, camera]);

  useEffect(() => {
    gameInput.reset();
    const down = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
      if (e.code === "ShiftLeft" || e.code === "ShiftRight") gameInput.setMove({ sprint: true });
    };
    const up = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
      if (e.code === "ShiftLeft" || e.code === "ShiftRight") gameInput.setMove({ sprint: false });
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

    let kx = 0;
    let ky = 0;
    if (keys.current["KeyW"] || keys.current["ArrowUp"]) ky += 1;
    if (keys.current["KeyS"] || keys.current["ArrowDown"]) ky -= 1;
    if (keys.current["KeyA"] || keys.current["ArrowLeft"]) kx -= 1;
    if (keys.current["KeyD"] || keys.current["ArrowRight"]) kx += 1;

    const touch = gameInput.getMove();
    let mx = kx + touch.x;
    let my = ky + touch.y;
    const mag = Math.hypot(mx, my);
    if (mag > 1) {
      mx /= mag;
      my /= mag;
    }

    const sprint =
      keys.current["ShiftLeft"] || keys.current["ShiftRight"] || touch.sprint;
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [resetToken, setResetToken] = useState(0);
  const shellRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const username = session?.user?.username || session?.user?.name || "You";
  const players = [{ id: "local", name: username, isYou: true }];

  useEffect(() => {
    const coarse =
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(max-width: 900px)").matches;
    setIsTouch(coarse);
    setHint(
      coarse
        ? "Left stick · LOOK pad · Menu ☰"
        : "Click canvas · WASD · Esc = Menu"
    );
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        e.preventDefault();
        if (document.pointerLockElement) document.exitPointerLock();
        setMenuOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onCanvasActivate = () => {
    if (menuOpen) return;
    if (!isTouch) {
      shellRef.current?.requestPointerLock?.() || document.body.requestPointerLock?.();
      setHint("WASD · Mouse look · Esc Menu · Shift sprint");
    }
  };

  const goFullscreen = async () => {
    try {
      if (!document.fullscreenElement) await shellRef.current?.requestFullscreen?.();
      else await document.exitFullscreen?.();
    } catch {
      /* */
    }
  };

  const closePointer = () => {
    if (document.pointerLockElement) document.exitPointerLock();
  };

  const handleReset = () => {
    setResetToken((t) => t + 1);
    setMenuOpen(false);
    closePointer();
  };

  const handleLeave = () => {
    setMenuOpen(false);
    closePointer();
    router.push(backHref);
  };

  return (
    <div
      ref={shellRef}
      className="fixed inset-0 z-[200] h-[100dvh] w-full flex flex-col bg-black overflow-hidden touch-none"
      style={{ WebkitTouchCallout: "none" }}
    >
      {/* Minimal in-game HUD — NOT platform nav */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-b from-black/80 to-transparent safe-top pointer-events-none">
        <div className="flex items-center gap-2 min-w-0 pointer-events-auto">
          <button
            type="button"
            onClick={() => {
              closePointer();
              setMenuOpen(true);
            }}
            className="p-2.5 rounded-xl bg-black/60 hover:bg-black/80 text-white shrink-0"
            title="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 className="font-semibold text-white text-sm truncate">{gameName}</h1>
            <p className="text-[11px] text-slate-300 truncate">
              {mode === "test" ? "TEST · " : ""}by {creator}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/50 text-xs text-white">
            <Users className="w-3.5 h-3.5" /> {players.length}
          </div>
          <button
            type="button"
            onClick={goFullscreen}
            className="p-2.5 rounded-xl bg-black/60 text-white"
            title="Fullscreen"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </div>

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

          <PlayerController resetToken={resetToken} />
        </Canvas>

        {!menuOpen && <MobileControls />}
      </div>

      {!isTouch && !menuOpen && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full bg-black/50 text-xs text-slate-300 pointer-events-none max-w-[90%] text-center">
          {hint}
        </div>
      )}

      {/* In-game Menu — players, leave, reset, back */}
      {menuOpen && (
        <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm">
          <div className="w-full sm:max-w-sm sm:mx-4 rounded-t-2xl sm:rounded-2xl bg-surface-900 border border-slate-700 shadow-2xl overflow-hidden mb-0">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
              <h2 className="font-bold text-white text-lg">Menu</h2>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:bg-surface-800 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-4 py-3 border-b border-slate-800">
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Players ({players.length})
              </p>
              <ul className="space-y-1.5 max-h-40 overflow-y-auto">
                {players.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-surface-800/60"
                  >
                    <div className="w-7 h-7 rounded-full bg-cool-600 flex items-center justify-center text-xs font-bold text-white">
                      {p.name[0]?.toUpperCase() || "?"}
                    </div>
                    <span className="text-sm text-white truncate">
                      {p.name}
                      {p.isYou && (
                        <span className="text-cool-400 text-xs ml-1">(You)</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 space-y-2 pb-safe">
              <button
                type="button"
                onClick={handleReset}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-surface-800 hover:bg-surface-700 text-white text-sm font-medium"
              >
                <RotateCcw className="w-5 h-5 text-amber-400" />
                Reset character
              </button>
              <button
                type="button"
                onClick={handleLeave}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-surface-800 hover:bg-red-900/40 text-white text-sm font-medium"
              >
                <LogOut className="w-5 h-5 text-red-400" />
                Leave game
              </button>
              <button
                type="button"
                onClick={handleLeave}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-cool-600 hover:bg-cool-500 text-white text-sm font-medium"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
