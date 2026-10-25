"use client";

import { useEffect, useState } from "react";
import { LOOK, LOOK_DEFAULTS, bumpLook, resetLook, subscribeLook } from "./lookConfig";

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-[11px] text-muted">
      <span className="w-16 shrink-0 uppercase tracking-wide">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="min-w-0 flex-1 accent-[#C9A84C]"
      />
      <span className="w-10 text-right text-fg tabular-nums">{value.toFixed(2)}</span>
    </label>
  );
}

export default function LookTuner() {
  const [, setRev] = useState(0);
  useEffect(() => subscribeLook(() => setRev(LOOK.rev)), []);

  const set = (key: keyof typeof LOOK_DEFAULTS, v: number) => {
    if (key === "albedo") return;
    (LOOK as Record<string, unknown>)[key] = v;
    bumpLook();
  };

  const setAlbedo = (k: keyof typeof LOOK.albedo, v: number) => {
    LOOK.albedo[k] = v;
    bumpLook();
  };

  const copy = () => {
    const { rev: _, ...rest } = LOOK;
    void navigator.clipboard.writeText(JSON.stringify(rest, null, 2));
  };

  return (
    <div className="fixed right-3 top-3 z-50 max-h-[90vh] w-64 overflow-y-auto rounded border border-line bg-ink/95 p-3 font-mono text-[11px] shadow-xl">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-caption uppercase text-gold">Look tuner</span>
        <div className="flex gap-2">
          <button type="button" onClick={copy} className="text-muted hover:text-gold">
            Copy
          </button>
          <button type="button" onClick={resetLook} className="text-muted hover:text-gold">
            Reset
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Slider label="exposure" value={LOOK.exposure} min={0.6} max={1.8} step={0.01} onChange={(v) => set("exposure", v)} />
        <Slider label="hemi" value={LOOK.hemi} min={0} max={3} step={0.05} onChange={(v) => set("hemi", v)} />
        <Slider label="key" value={LOOK.key} min={0} max={8} step={0.1} onChange={(v) => set("key", v)} />
        <Slider label="fill" value={LOOK.fill} min={0} max={3} step={0.05} onChange={(v) => set("fill", v)} />
        <Slider label="top" value={LOOK.top} min={0} max={3} step={0.05} onChange={(v) => set("top", v)} />
        <Slider label="rimL" value={LOOK.rimL} min={0} max={200} step={1} onChange={(v) => set("rimL", v)} />
        <Slider label="rimR" value={LOOK.rimR} min={0} max={200} step={1} onChange={(v) => set("rimR", v)} />
        <Slider label="box" value={LOOK.albedo.box} min={0} max={120} step={1} onChange={(v) => setAlbedo("box", v)} />
        <Slider label="tray" value={LOOK.albedo.tray} min={0} max={120} step={1} onChange={(v) => setAlbedo("tray", v)} />
        <Slider label="lid" value={LOOK.albedo.lid} min={0} max={120} step={1} onChange={(v) => setAlbedo("lid", v)} />
        <Slider label="jar" value={LOOK.albedo.jar} min={0} max={120} step={1} onChange={(v) => setAlbedo("jar", v)} />
        <Slider label="jarEnv" value={LOOK.jarEnv} min={0} max={4} step={0.1} onChange={(v) => set("jarEnv", v)} />
        <Slider label="matEnv" value={LOOK.matEnv} min={0} max={4} step={0.1} onChange={(v) => set("matEnv", v)} />
        <Slider label="halo" value={LOOK.halo} min={0} max={0.12} step={0.005} onChange={(v) => set("halo", v)} />
        <Slider label="shadow" value={LOOK.shadow} min={0} max={1} step={0.05} onChange={(v) => set("shadow", v)} />
      </div>
    </div>
  );
}
