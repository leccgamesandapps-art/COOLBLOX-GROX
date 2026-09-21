"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gameInput } from "./inputStore";

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

/** Left virtual joystick for movement */
function Joystick() {
  const baseRef = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const active = useRef(false);
  const origin = useRef({ x: 0, y: 0 });

  const update = useCallback((clientX: number, clientY: number) => {
    const max = 40;
    let dx = clientX - origin.current.x;
    let dy = clientY - origin.current.y;
    const len = Math.hypot(dx, dy) || 1;
    if (len > max) {
      dx = (dx / len) * max;
      dy = (dy / len) * max;
    }
    setKnob({ x: dx, y: dy });
    // y inverted: up on screen = forward
    gameInput.setMove({
      x: clamp(dx / max, -1, 1),
      y: clamp(-dy / max, -1, 1)
    });
  }, []);

  const end = useCallback(() => {
    active.current = false;
    setKnob({ x: 0, y: 0 });
    gameInput.setMove({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!active.current) return;
      e.preventDefault();
      update(e.clientX, e.clientY);
    };
    const onUp = () => end();
    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [update, end]);

  return (
    <div
      ref={baseRef}
      className="relative w-28 h-28 rounded-full bg-white/15 border border-white/25 touch-none select-none"
      onPointerDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        active.current = true;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        const rect = baseRef.current!.getBoundingClientRect();
        origin.current = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };
        update(e.clientX, e.clientY);
      }}
    >
      <div
        className="absolute w-12 h-12 rounded-full bg-white/40 border border-white/50 left-1/2 top-1/2"
        style={{
          transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))`
        }}
      />
    </div>
  );
}

/** Right look pad — drag to look around */
function LookPad() {
  const active = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!active.current) return;
      e.preventDefault();
      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;
      last.current = { x: e.clientX, y: e.clientY };
      gameInput.addLook(dx * 0.35, dy * 0.35);
    };
    const onUp = () => {
      active.current = false;
    };
    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <div
      className="w-32 h-32 rounded-full bg-white/10 border border-white/20 touch-none select-none flex items-center justify-center text-[10px] text-white/50"
      onPointerDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        active.current = true;
        last.current = { x: e.clientX, y: e.clientY };
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      }}
    >
      LOOK
    </div>
  );
}

export function MobileControls() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const coarse =
      typeof window !== "undefined" &&
      (window.matchMedia("(pointer: coarse)").matches ||
        window.matchMedia("(max-width: 900px)").matches);
    setShow(coarse);
  }, []);

  if (!show) return null;

  return (
    <div className="absolute inset-x-0 bottom-0 z-30 pointer-events-none pb-safe">
      <div className="flex justify-between items-end px-4 pb-6 pt-2 pointer-events-auto">
        <Joystick />
        <div className="flex flex-col gap-3 items-center">
          <button
            type="button"
            className="w-14 h-14 rounded-full bg-cool-600/80 border border-cool-400/50 text-white text-xs font-bold active:scale-95 touch-none"
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              gameInput.setMove({ sprint: true });
            }}
            onPointerUp={(e) => {
              e.preventDefault();
              gameInput.setMove({ sprint: false });
            }}
            onPointerCancel={() => gameInput.setMove({ sprint: false })}
          >
            RUN
          </button>
          <LookPad />
        </div>
      </div>
    </div>
  );
}
