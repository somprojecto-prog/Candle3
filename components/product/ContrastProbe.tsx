"use client";

import { useEffect, useState } from "react";
import { LOOK_INFO } from "./lookConfig";

interface ContrastProbeProps {
  selector: string; // seletor CSS do <canvas> a medir
  mode: "story" | "static";
  getPhase?: () => number;
  getReveal?: () => number;
}
interface Metrics {
  body: number;
  edge: number;
  clip: number;
  w: number;
  h: number;
  halo: number;
  dyn: number;
}

const BG = 5; // #050505
const TONES = ["None", "Linear", "Reinhard", "Cineon", "ACESFilmic", "Custom", "AgX", "Neutral"];

function pct(hist: Uint32Array, n: number, q: number): number {
  let acc = 0;
  for (let i = 0; i < 256; i++) {
    acc += hist[i];
    if (acc >= q * n) return i;
  }
  return 255;
}

/** Dev only. Compõe sobre #050505 (luma Rec.709), máscara alpha > 0.6. */
function measure(src: HTMLCanvasElement): Metrics | null {
  const w = Math.min(480, src.width);
  const h = Math.round((src.height * w) / Math.max(src.width, 1));
  if (w < 8 || h < 8) return null;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(src, 0, 0, w, h);
  const d = ctx.getImageData(0, 0, w, h).data;
  const Y = new Float32Array(w * h);
  const M = new Uint8Array(w * h);
  const bodyHist = new Uint32Array(256);
  let n = 0, sum = 0, clip = 0, halo = 0, x0 = w, x1 = -1, y0 = h, y1 = -1;
  for (let p = 0; p < w * h; p++) {
    const a = d[p * 4 + 3] / 255;
    Y[p] = a * (0.2126 * d[p * 4] + 0.7152 * d[p * 4 + 1] + 0.0722 * d[p * 4 + 2]) + (1 - a) * BG;
    if (a <= 0.6) {
      if (Y[p] > halo) halo = Y[p];
      continue;
    }
    const x = p % w, y = (p / w) | 0;
    M[p] = 1; n++; sum += Y[p];
    bodyHist[Math.min(255, Math.round(Y[p]))]++;
    if (Y[p] >= 250) clip++;
    x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
  }
  if (!n) return null;
  const edgeHist = new Uint32Array(256);
  let e = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const p = y * w + x;
      if (!M[p]) continue;
      if (x === 0 || y === 0 || x === w - 1 || y === h - 1 || !M[p - 1] || !M[p + 1] || !M[p - w] || !M[p + w]) {
        edgeHist[Math.min(255, Math.round(Y[p]))]++;
        e++;
      }
    }
  }
  return {
    body: sum / n,
    edge: pct(edgeHist, e, 0.9),
    clip: (100 * clip) / n,
    w: ((x1 - x0 + 1) / w) * 100,
    h: ((y1 - y0 + 1) / h) * 100,
    halo,
    dyn: pct(bodyHist, n, 0.95) - pct(bodyHist, n, 0.05),
  };
}

export default function ContrastProbe({ selector, mode, getPhase, getReveal }: ContrastProbeProps) {
  const [m, setM] = useState<Metrics | null>(null);
  const [info, setInfo] = useState({ tone: -1, exposure: 0, phase: 0, reveal: 0 });

  useEffect(() => {
    const id = window.setInterval(() => {
      const el = document.querySelector<HTMLCanvasElement>(selector);
      if (el) setM(measure(el));
      setInfo({
        tone: LOOK_INFO.tone,
        exposure: LOOK_INFO.exposure,
        phase: getPhase?.() ?? 0,
        reveal: getReveal?.() ?? 0,
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [selector, getPhase, getReveal]);

  const story = mode === "story";
  const rows: [string, string, boolean][] = m
    ? [
        ["bodyMean 40–120", m.body.toFixed(0), m.body >= 40 && m.body <= 120],
        ["edgeP90 ≥106", String(m.edge), m.edge >= 106],
        ["clipPct ≤0.5", m.clip.toFixed(2), m.clip <= 0.5],
        ["dynRange ≥80", String(m.dyn), m.dyn >= 80],
        ["halo peak ≤38", m.halo.toFixed(0), m.halo <= 38],
        [story ? "width% (hero 31–36)" : "width% 80–92", m.w.toFixed(1), story ? m.w >= 31 && m.w <= 36 : m.w >= 80 && m.w <= 92],
        [story ? "height% ≥50" : "height% ≤92", m.h.toFixed(1), story ? m.h >= 50 : m.h <= 92],
      ]
    : [];

  return (
    <div
      style={{ position: "fixed", left: 12, bottom: 12, zIndex: 9999, font: "12px system-ui, sans-serif", background: "rgba(0,0,0,0.85)", border: "1px solid #1F1F1F", padding: "8px 10px", color: "#F5F5F5" }}
    >
      <div style={{ color: info.tone === 7 ? "#4ADE80" : "#F87171" }}>
        tone: {TONES[info.tone] ?? "?"} · exposure {info.exposure.toFixed(2)}
      </div>
      {story && (
        <div style={{ color: "#A3A3A3" }}>
          phase: {info.phase.toFixed(2)} · reveal: {info.reveal.toFixed(2)} (scale valid at phase 0)
        </div>
      )}
      {!m && <div>probe: waiting for a frame…</div>}
      {rows.map(([label, value, ok]) => (
        <div key={label} style={{ color: ok ? "#4ADE80" : "#F87171" }}>
          {label}: {value}
        </div>
      ))}
    </div>
  );
}