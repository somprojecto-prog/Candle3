"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import ContrastProbe from "@/components/product/ContrastProbe";
import LookTuner from "@/components/product/LookTuner";
import { resetStoryState, STORY_FOCUS, STORY_FOCUS_MOBILE, STORY_STEPS, storyState } from "@/lib/story";
import { smooth } from "./storySmooth";

const StoryCanvas = dynamic(() => import("./StoryCanvas"), { ssr: false });

const MAX = STORY_STEPS.length - 1;
const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
const getPhase = () => smooth.phase;
const getReveal = () => smooth.reveal;

function focusAt(phase: number, aspect: number, mobile: boolean): [number, number] {
  const table = mobile ? STORY_FOCUS_MOBILE : STORY_FOCUS;
  const p = Math.min(Math.max(phase, 0), MAX);
  const i = Math.min(Math.floor(p), MAX - 1);
  const t = p - i;
  const a = table[i];
  const b = table[i + 1];
  let fx = a[0] + (b[0] - a[0]) * t;
  const fy = a[1] + (b[1] - a[1]) * t;
  if (!mobile && aspect < 1.5) fx = 0.5 + (fx - 0.5) * clamp01((aspect - 1) / 0.5);
  return [fx, fy];
}

interface StoryDevProps {
  initialPhase: number;
  initialReveal: number;
  probe: boolean;
  tune: boolean;
}

export default function StoryDev({ initialPhase, initialReveal, probe, tune }: StoryDevProps) {
  const [phase, setPhase] = useState(Math.min(Math.max(initialPhase, 0), MAX));
  const [reveal, setReveal] = useState(clamp01(initialReveal));
  const [size, setSize] = useState({ w: 1600, h: 900 });

  // ÚNICA exceção à regra de só-leitura: esta página dev escreve storyState (o A faz isto em produção)
  useEffect(() => {
    storyState.phase = phase;
    storyState.reveal = reveal;
    storyState.active = true;
  }, [phase, reveal]);

  useEffect(() => () => resetStoryState(), []);

  useEffect(() => {
    const update = () => setSize({ w: window.innerWidth, h: Math.max(window.innerHeight, 1) });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const goStep = (i: number) => {
    setPhase(i);
    if (i <= 0) setReveal(0);
    else if (i >= 2) setReveal(1); // fora do passo reveal, o A escreve 0 antes e 1 depois
  };

  const [fx, fy] = focusAt(phase, size.w / size.h, size.w < 768);

  return (
    <div className="fixed inset-0 bg-[#050505] text-fg">
      <StoryCanvas />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute z-20 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold"
        style={{ left: `${fx * 100}%`, top: `${fy * 100}%` }}
      />

      {probe && <ContrastProbe selector="canvas" mode="story" getPhase={getPhase} getReveal={getReveal} />}
      {tune && <LookTuner />}

      <div className="absolute inset-x-0 bottom-0 z-30 flex flex-wrap items-center justify-end gap-x-4 gap-y-2 border-t border-line bg-ink/90 px-6 py-4">
        <span className="text-label font-mono uppercase text-gold">phase {phase.toFixed(2)}</span>
        <input
          type="range"
          min={0}
          max={MAX}
          step={0.01}
          value={phase}
          onChange={(e) => setPhase(Number(e.target.value))}
          className="min-w-[200px] flex-1 accent-[#C9A227]"
          aria-label="Story phase"
        />
        <span className="text-label font-mono uppercase text-gold">reveal {reveal.toFixed(2)}</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={reveal}
          onChange={(e) => setReveal(Number(e.target.value))}
          className="min-w-[200px] flex-1 accent-[#C9A227]"
          aria-label="Reveal progress"
        />
        <div className="flex flex-wrap gap-2">
          {STORY_STEPS.map((name, i) => (
            <button
              key={name}
              type="button"
              onClick={() => goStep(i)}
              className="rounded border border-line px-3 py-1 text-label font-mono uppercase text-muted hover:border-gold hover:text-gold"
            >
              {i} {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}