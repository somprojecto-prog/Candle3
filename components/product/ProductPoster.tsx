"use client";

import { useId } from "react";
import type { ProductView } from "@/lib/constants";

interface ProductPosterProps {
  view: ProductView;
  className?: string;
  /** hero/offer: recorte rente à silhueta (o StoryPoster usa para igualar a largura do 3D). */
  tight?: boolean;
  /** false: sem o halo radial próprio. */
  halo?: boolean;
}

const HALO = "radial-gradient(60% 55% at 50% 52%, rgba(255,241,220,0.10), rgba(255,241,220,0) 70%)";
const EDGE = "#6A6A6A";
const GOLD = "#C9A227";

const VIEWBOX: Record<ProductView, string> = {
  hero: "-45 -40 720 620",
  reveal: "120 14 360 470",
  intention: "140 162 320 332",
  offer: "-45 -40 720 620",
};
const VIEWBOX_BOX_TIGHT = "-12 -12 654 564"; // 630×540 de silhueta → 96% da largura

function Tray() {
  return (
    <g strokeLinejoin="round" stroke={EDGE} strokeOpacity="0.7" strokeWidth="1">
      <polygon points="160,354 300,392 300,458 160,420" fill="#1E1E1E" />
      <polygon points="300,392 440,354 440,420 300,458" fill="#151515" />
      <polygon points="160,354 300,316 440,354 300,392" fill="#2A2A2A" />
      <polygon points="178,354 300,321 422,354 300,387" fill="none" stroke={GOLD} strokeOpacity="0.5" strokeWidth="0.8" />
      <ellipse cx="300" cy="354" rx="86" ry="21" fill="none" stroke={GOLD} strokeOpacity="0.5" strokeWidth="0.8" />
    </g>
  );
}

function Jar({ jar }: { jar: string }) {
  return (
    <g stroke={EDGE} strokeOpacity="0.7" strokeWidth="1">
      <path d="M223 216 V354 A77 18 0 0 0 377 354 V216 Z" fill={`url(#${jar})`} />
      <rect x="240" y="224" width="9" height="124" rx="4.5" fill="#fff" opacity="0.16" stroke="none" />
      <rect x="352" y="228" width="3" height="116" rx="1.5" fill="#fff" opacity="0.1" stroke="none" />
      <ellipse cx="300" cy="216" rx="77" ry="18" fill="#1C1C1C" />
    </g>
  );
}

function Lid() {
  return (
    <g stroke={EDGE} strokeOpacity="0.7" strokeWidth="1">
      <path d="M217 194 V216 A83 20 0 0 0 383 216 V194 Z" fill="#1C1C1C" />
      <ellipse cx="300" cy="194" rx="83" ry="20" fill="#2C2C2C" />
      <ellipse cx="300" cy="194" rx="62" ry="14.5" fill="none" stroke={GOLD} strokeOpacity="0.5" strokeWidth="0.8" />
    </g>
  );
}

/** Capa pairando (contorno tracejado) acima da vela aberta. */
function LiftedCap() {
  return (
    <g fill="none" stroke={EDGE} strokeOpacity="0.55" strokeWidth="1" strokeDasharray="5 5" strokeLinejoin="round">
      <polygon points="168,64 300,28 432,64 300,100" />
      <polyline points="168,64 168,104 300,140 432,104 432,64" />
      <line x1="300" y1="100" x2="300" y2="140" />
    </g>
  );
}

/** Caixa fechada sobre a bandeja, ¾ (azim 30°, elev 13°): mesmas proporções que o 3D (630×540). */
function GiftBox({ face }: { face: string }) {
  return (
    <g strokeLinejoin="round">
      <g stroke={EDGE} strokeOpacity="0.6" strokeWidth="1">
        <polygon points="9,380 391,429 391,536 9,487" fill="#1E1E1E" />
        <polygon points="391,429 621,340 621,447 391,536" fill="#151515" />
      </g>
      <g stroke={EDGE} strokeOpacity="0.7" strokeWidth="1">
        <polygon points="1,92 393,143 393,435 1,384" fill={`url(#${face})`} />
        <polygon points="393,143 629,51 629,343 393,435" fill="#1A1A1A" />
        <polygon points="1,92 237,0 629,51 393,143" fill="#323232" />
      </g>
      <polyline points="1,92 393,143 629,51" fill="none" stroke={EDGE} strokeOpacity="0.95" strokeWidth="1.4" />
      <line x1="393" y1="143" x2="393" y2="435" stroke={EDGE} strokeOpacity="0.9" strokeWidth="1.4" />
      <g transform="translate(1 92) skewY(7.4)">
        <rect x="0" y="258" width="391" height="34" fill={GOLD} fillOpacity="0.4" />
        <circle cx="196" cy="100" r="26" fill="none" stroke={GOLD} strokeOpacity="0.5" strokeWidth="1.2" />
      </g>
      <polyline points="1,384 393,435 629,343" fill="none" stroke={GOLD} strokeOpacity="0.5" strokeWidth="1.2" />
    </g>
  );
}

/** SVG estático: o que aparece até ao primeiro frame e sem WebGL. Lê-se em < 1 s. */
export default function ProductPoster({ view, className = "h-full w-full", tight = false, halo = true }: ProductPosterProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const jar = `${uid}j`;
  const face = `${uid}f`;
  const isBox = view === "hero" || view === "offer";
  const viewBox = isBox && tight ? VIEWBOX_BOX_TIGHT : VIEWBOX[view];

  return (
    <div aria-hidden="true" className={className} style={halo ? { backgroundImage: HALO } : undefined}>
      <svg viewBox={viewBox} preserveAspectRatio="xMidYMid meet" className="h-full w-full" focusable="false">
        <defs>
          <linearGradient id={jar} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#0E0E0E" />
            <stop offset="0.22" stopColor="#3A3A3A" />
            <stop offset="0.34" stopColor="#161616" />
            <stop offset="0.7" stopColor="#0E0E0E" />
            <stop offset="1" stopColor="#2A2A2A" />
          </linearGradient>
          <linearGradient id={face} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#2E2E2E" />
            <stop offset="1" stopColor="#222222" />
          </linearGradient>
        </defs>

        {isBox ? (
          <GiftBox face={face} />
        ) : (
          <g>
            {view === "reveal" && <LiftedCap />}
            <Tray />
            <Jar jar={jar} />
            <Lid />
          </g>
        )}
      </svg>
    </div>
  );
}