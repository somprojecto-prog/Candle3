"use client";

import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import type { ProductView } from "@/lib/constants";
import { PERF, getPerfTier } from "@/components/story-canvas/perfTier";
import { probeEnabled } from "./config";
import { LOOK } from "./lookConfig";
import ProductPoster from "./ProductPoster";
import ProductScene from "./ProductScene";

export interface ProductViewerProps {
  view: ProductView;
  className?: string;
  /** Mantida na API por compatibilidade; IGNORADA (sem interação livre). */
  interactive?: boolean;
  priority?: boolean;
  label?: string;
  debugCamera?: Partial<{ azim: number; elev: number; dist: number; fov: number; targetY: number }>;
}

const DEFAULT_LABELS: Record<ProductView, string> = {
  hero: "Deep Work candle gift box, three-quarter view",
  reveal: "Deep Work candle with the box lid lifted away",
  intention: "Close-up of the candle jar and base",
  offer: "Deep Work candle gift box",
};

const CAMERA = { fov: 28, near: 0.1, far: 60, position: [0, 0, 8] as [number, number, number] };

let webglSupport: boolean | undefined;
function hasWebGL(): boolean {
  if (webglSupport !== undefined) return webglSupport;
  try {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") ?? c.getContext("webgl")) as
      | WebGLRenderingContext
      | WebGL2RenderingContext
      | null;
    webglSupport = !!gl;
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

class CanvasBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }
  componentDidCatch(error: Error): void {
    console.error("[ProductViewer] WebGL failed; showing poster.", error);
    this.props.onError();
  }
  render(): ReactNode {
    return this.state.failed ? null : this.props.children;
  }
}

export default function ProductViewer({ view, className, priority = false, label, debugCamera }: ProductViewerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [supported] = useState(hasWebGL);
  const [tier] = useState(getPerfTier);
  const [mounted, setMounted] = useState(priority);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const perf = PERF[tier];

  // Ciclo de vida: monta perto do viewport e DESMONTA ao se afastar (libera o contexto WebGL)
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setMounted(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        const on = entries[entries.length - 1].isIntersecting;
        setMounted(on);
        if (!on) {
          setReady(false);
          setFailed(false);
        }
      },
      { rootMargin: "50% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const handleReady = useCallback(() => setReady(true), []);
  const handleFail = useCallback(() => setFailed(true), []);

  const handleCreated = useCallback(({ gl }: { gl: THREE.WebGLRenderer }) => {
    gl.toneMapping = THREE.NeutralToneMapping;
    gl.toneMappingExposure = LOOK.exposure;
    gl.setClearColor(0x000000, 0);
    gl.domElement.addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
      setFailed(true);
    });
  }, []);

  const showCanvas = mounted && supported && !failed;
  const gl = {
    alpha: true,
    antialias: perf.antialias,
    powerPreference: "high-performance" as const,
    toneMapping: THREE.NeutralToneMapping,
    ...(probeEnabled() ? { preserveDrawingBuffer: true } : {}),
  };

  return (
    <div
      ref={rootRef}
      role="img"
      aria-label={label ?? DEFAULT_LABELS[view]}
      className={`relative h-full w-full ${className ?? ""}`}
    >
      {showCanvas && (
        <div className="absolute inset-0">
          <CanvasBoundary onError={handleFail}>
            <Canvas frameloop="demand" dpr={perf.dpr} camera={CAMERA} gl={gl} onCreated={handleCreated}>
              <ProductScene view={view} onReady={handleReady} debugCamera={debugCamera} />
            </Canvas>
          </CanvasBoundary>
        </div>
      )}

      <ProductPoster
        view={view}
        className={`pointer-events-none absolute inset-0 transition-opacity duration-300 motion-reduce:transition-none ${
          showCanvas && ready ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
}