"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gameInput } from "./inputStore";

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

/**
 * Left virtual joystick — only responds to the finger that started on it (pointerId).
 * Second finger on LOOK never affects this control.
 */
function Joystick() {
  const baseRef = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  /** Only this pointer drives the stick */
  const stickPointerId = useRef<number | null>(null);
  const origin = useRef({ x: 0, y: 0 });

  const applyStick = useCallback((clientX: number, clientY: number) => {
    const max = 42;
    let dx = clientX - origin.current.x;
    let dy = clientY - origin.current.y;
    const len = Math.hypot(dx, dy) || 1;
    if (len > max) {
      dx = (dx / len) * max;
      dy = (dy / len) * max;
    }
    setKnob({ x: dx, y: dy });
    gameInput.setMove({
      x: clamp(dx / max, -1, 1),
      y: clamp(-dy / max, -1, 1) // screen up = forward
    });
  }, []);

  const releaseStick = useCallback((pointerId: number) => {
    if (stickPointerId.current !== pointerId) return;
    stickPointerId.current = null;
    setKnob({ x: 0, y: 0 });
    gameInput.setMove({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      // Ignore every finger that is not the stick owner
      if (stickPointerId.current === null || e.pointerId !== stickPointerId.current) return;
      e.preventDefault();
      e.stopPropagation();
      applyStick(e.clientX, e.clientY);
    };

    const onPointerUp = (e: PointerEvent) => {
      releaseStick(e.pointerId);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: false });
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [applyStick, releaseStick]);

  return (
    <div
      ref={baseRef}
      className="relative w-28 h-28 rounded-full bg-white/15 border border-white/25 touch-none select-none"
      style={{ touchAction: "none" }}
      onPointerDown={(e) => {
        // Already tracking a finger on the stick — ignore extra fingers on same pad
        if (stickPointerId.current !== null) return;
        e.preventDefault();
        e.stopPropagation();
        stickPointerId.current = e.pointerId;
        try {
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        } catch {
          /* some browsers */
        }
        const rect = baseRef.current!.getBoundingClientRect();
        origin.current = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };
        applyStick(e.clientX, e.clientY);
      }}
      onPointerUp={(e) => releaseStick(e.pointerId)}
      onPointerCancel={(e) => releaseStick(e.pointerId)}
    >
      <div
        className="absolute w-12 h-12 rounded-full bg-white/40 border border-white/50 left-1/2 top-1/2 pointer-events-none"
        style={{
          transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))`
        }}
      />
    </div>
  );
}

/**
 * Right look pad — only the finger that started on LOOK moves the camera.
 * Joystick finger is ignored completely.
 */
function LookPad() {
  const lookPointerId = useRef<number | null>(null);
  const last = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (lookPointerId.current === null || e.pointerId !== lookPointerId.current) return;
      e.preventDefault();
      e.stopPropagation();
      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;
      last.current = { x: e.clientX, y: e.clientY };
      // Only this finger adds look delta
      gameInput.addLook(dx * 0.4, dy * 0.4);
    };

    const onPointerUp = (e: PointerEvent) => {
      if (lookPointerId.current === e.pointerId) {
        lookPointerId.current = null;
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: false });
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  return (
    <div
      className="w-32 h-32 rounded-full bg-white/10 border border-white/20 touch-none select-none flex items-center justify-center text-[10px] text-white/50"
      style={{ touchAction: "none" }}
      onPointerDown={(e) => {
        if (lookPointerId.current !== null) return;
        e.preventDefault();
        e.stopPropagation();
        lookPointerId.current = e.pointerId;
        last.current = { x: e.clientX, y: e.clientY };
        try {
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        } catch {
          /* */
        }
      }}
      onPointerUp={(e) => {
        if (lookPointerId.current === e.pointerId) lookPointerId.current = null;
      }}
      onPointerCancel={(e) => {
        if (lookPointerId.current === e.pointerId) lookPointerId.current = null;
      }}
    >
      LOOK
    </div>
  );
}

function RunButton() {
  const runPointerId = useRef<number | null>(null);

  const endRun = (pointerId: number) => {
    if (runPointerId.current !== pointerId) return;
    runPointerId.current = null;
    gameInput.setMove({ sprint: false });
  };

  return (
    <button
      type="button"
      className="w-14 h-14 rounded-full bg-cool-600/80 border border-cool-400/50 text-white text-xs font-bold active:scale-95 touch-none"
      style={{ touchAction: "none" }}
      onPointerDown={(e) => {
        if (runPointerId.current !== null) return;
        e.preventDefault();
        e.stopPropagation();
        runPointerId.current = e.pointerId;
        gameInput.setMove({ sprint: true });
        try {
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        } catch {
          /* */
        }
      }}
      onPointerUp={(e) => endRun(e.pointerId)}
      onPointerCancel={(e) => endRun(e.pointerId)}
    >
      RUN
    </button>
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
    <div
      className="absolute inset-x-0 bottom-0 z-30 pointer-events-none pb-safe"
      // Prevent the whole play canvas from stealing these touches
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-end px-4 pb-6 pt-2 pointer-events-auto">
        {/* LEFT finger zone — move only */}
        <Joystick />

        {/* RIGHT finger zone — look + sprint only */}
        <div className="flex flex-col gap-3 items-center">
          <RunButton />
          <LookPad />
        </div>
      </div>
    </div>
  );
}
