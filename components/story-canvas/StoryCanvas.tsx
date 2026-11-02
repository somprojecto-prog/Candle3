"use client";

import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas, type RootState } from "@react-three/fiber";
import * as THREE from "three";
import { probeEnabled } from "@/components/product/config";
import { LOOK } from "@/components/product/lookConfig";
import { failStory } from "@/lib/story";
import { PERF, getPerfTier } from "./perfTier";
import StoryPoster from "./StoryPoster";
import StoryScene from "./StoryScene";

const CAMERA = { fov: 28, near: 0.1, far: 60, position: [0, 0, 8] as [number, number, number] };
const RESTORE_TIMEOUT_MS = 2000;

class CanvasBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  componentDidCatch(error: Error): void {
    console.error("[StoryCanvas] WebGL failed; falling back to off mode.", error);
    failStory();
  }

  render(): ReactNode {
    return this.state.failed ? null : this.props.children;
  }
}

export default function StoryCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const detachRef = useRef<(() => void) | null>(null);
  const [ready, setReady] = useState(false);
  const [tier] = useState(getPerfTier);
  const perf = PERF[tier];

  // O evento de falha de contexto não faz bubble, mas passa na fase de captura
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const onCreateError = () => failStory();
    wrap.addEventListener("webglcontextcreationerror", onCreateError, true);
    return () => wrap.removeEventListener("webglcontextcreationerror", onCreateError, true);
  }, []);

  useEffect(
    () => () => {
      detachRef.current?.();
      detachRef.current = null;
    },
    [],
  );

  const handleCreated = useCallback(({ gl, invalidate }: RootState) => {
    gl.toneMapping = THREE.NeutralToneMapping;
    gl.toneMappingExposure = LOOK.exposure;
    gl.setClearColor(0x000000, 0);
    detachRef.current?.();

    const el = gl.domElement;
    let timer = 0;

    const onLost = (e: Event) => {
      e.preventDefault();
      window.clearTimeout(timer);
      timer = window.setTimeout(() => failStory(), RESTORE_TIMEOUT_MS);
    };
    const onRestored = () => {
      window.clearTimeout(timer);
      invalidate();
    };

    el.addEventListener("webglcontextlost", onLost);
    el.addEventListener("webglcontextrestored", onRestored);
    detachRef.current = () => {
      window.clearTimeout(timer);
      el.removeEventListener("webglcontextlost", onLost);
      el.removeEventListener("webglcontextrestored", onRestored);
    };
  }, []);

  const handleReady = useCallback(() => setReady(true), []);

  const gl = {
    alpha: true,
    antialias: perf.antialias,
    powerPreference: "high-performance" as const,
    toneMapping: THREE.NeutralToneMapping,
    ...(probeEnabled() ? { preserveDrawingBuffer: true } : {}),
  };

  return (
    <div ref={wrapRef} className="pointer-events-none absolute inset-0">
      <CanvasBoundary>
        <Canvas frameloop="demand" dpr={perf.dpr} camera={CAMERA} gl={gl} onCreated={handleCreated}>
          <StoryScene onReady={handleReady} />
        </Canvas>
      </CanvasBoundary>
      <StoryPoster hidden={ready} />
    </div>
  );
}