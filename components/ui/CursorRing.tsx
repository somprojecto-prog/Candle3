"use client";

import { useEffect, useRef } from "react";

const TARGETS = 'a, button, [role="button"], [data-cursor]';
const HALF = 14; // 28px / 2

export default function CursorRing() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = ref.current;
    if (!fine || reduced || !el) return;

    let x = 0;
    let y = 0;
    let raf = 0;
    let visible = false;

    const render = () => {
      raf = 0;
      el.style.transform = `translate3d(${x - HALF}px, ${y - HALF}px, 0)`;
    };

    const setVisible = (v: boolean) => {
      if (v === visible) return;
      visible = v;
      el.style.opacity = v ? "1" : "0";
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const t = e.target;
      setVisible(t instanceof Element && t.closest(TARGETS) !== null);
      if (!raf) raf = requestAnimationFrame(render);
    };

    const onLeave = () => setVisible(false);

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[110] h-7 w-7 rounded-full border border-gold/60 opacity-0 transition-opacity duration-150 motion-reduce:hidden"
      style={{ willChange: "transform" }}
    />
  );
}