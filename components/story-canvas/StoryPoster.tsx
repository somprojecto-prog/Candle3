"use client";

import ProductPoster from "@/components/product/ProductPoster";
import { STORY_FOCUS, STORY_FOCUS_MOBILE } from "@/lib/story";

const CENTER = "translate(-50%, -50%)";

interface PosterProps {
  fx: number;
  fy: number;
  width: string;
  className: string;
}

function Poster({ fx, fy, width, className }: PosterProps) {
  const left = `${fx * 100}%`;
  const top = `${fy * 100}%`;
  return (
    <div className={className}>
      {/* Halo: mesmo pico e cor do BackdropGlow */}
      <div
        className="absolute"
        style={{
          left,
          top,
          width: `calc(${width} * 1.7)`,
          aspectRatio: "1 / 1",
          transform: CENTER,
          background: "radial-gradient(closest-side, rgba(255,241,220,0.10), rgba(255,241,220,0))",
        }}
      />
      <div className="absolute" style={{ left, top, width, aspectRatio: "654 / 564", transform: CENTER }}>
        <ProductPoster view="hero" tight halo={false} className="h-full w-full" />
      </div>
    </div>
  );
}

/**
 * Poster do passo 0 (caixa fechada ¾) até ao primeiro frame, na coluna do produto:
 * ≈34vw no desktop (centrado em STORY_FOCUS[0]), ≈70vw no mobile (STORY_FOCUS_MOBILE[0]).
 */
export default function StoryPoster({ hidden }: { hidden: boolean }) {
  const fade = `pointer-events-none absolute inset-0 z-10 overflow-hidden transition-opacity duration-300 motion-reduce:transition-none ${
    hidden ? "opacity-0" : "opacity-100"
  }`;
  return (
    <>
      <Poster fx={STORY_FOCUS[0][0]} fy={STORY_FOCUS[0][1]} width="34vw" className={`${fade} max-md:hidden`} />
      <Poster
        fx={STORY_FOCUS_MOBILE[0][0]}
        fy={STORY_FOCUS_MOBILE[0][1]}
        width="70vw"
        className={`${fade} md:hidden`}
      />
    </>
  );
}