import * as THREE from "three";
import { BRAND, COLORS, EMBLEM_PATH, TAGLINE } from "@/lib/constants";
import { BOX_DECALS } from "./config";
import { BOX_LOOK, LOOK } from "./lookConfig";
import { bindEnv } from "./materials";

const SERIF = 'Georgia, "Times New Roman", serif';
const SLOGAN = TAGLINE.toUpperCase();
const MAX_TEX_W = 2048;

// ---------- foil ----------
/** Gradiente diagonal do foil: o ponto médio é o token #C9A84C. */
function foilGradient(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number): CanvasGradient {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  g.addColorStop(0, "#E2C766");
  g.addColorStop(0.5, COLORS.gold);
  g.addColorStop(1, "#9C7C2B");
  return g;
}

/** Foil metálico: metalness 0.92, rugosidade 0.30, emissivo discreto com o próprio mapa. */
export function createFoilMaterial(map: THREE.Texture): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({
    map,
    color: "#ffffff",
    metalness: 0.92,
    roughness: 0.3,
    emissive: new THREE.Color(COLORS.gold),
    emissiveMap: map,
    emissiveIntensity: BOX_LOOK.foilEmissive,
    transparent: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
  });
  bindEnv(
    m,
    () => LOOK.matEnv * BOX_LOOK.foilEnv,
    () => {
      m.emissiveIntensity = BOX_LOOK.foilEmissive;
    },
  );
  return m;
}

// ---------- utilidades ----------
/** O <img> é partilhado (não é recurso GL); cada visualizador cria a sua textura. */
let emblemPromise: Promise<HTMLImageElement | null> | null = null;
function loadEmblem(): Promise<HTMLImageElement | null> {
  if (!emblemPromise) {
    emblemPromise = new Promise((resolve) => {
      if (typeof Image === "undefined") {
        resolve(null);
        return;
      }
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = EMBLEM_PATH;
    });
  }
  return emblemPromise;
}

interface CanvasTex {
  ctx: CanvasRenderingContext2D | null;
  tex: THREE.CanvasTexture;
  w: number;
  h: number;
}

/** Coordenadas lógicas w×h; resolução real até 2048 px de largura (ctx.scale). */
function makeCanvasTexture(w: number, h: number, maxK = 1.5): CanvasTex {
  const k = Math.min(maxK, MAX_TEX_W / w);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(w * k);
  canvas.height = Math.round(h * k);
  const ctx = canvas.getContext("2d");
  ctx?.scale(k, k);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return { ctx, tex, w, h };
}

/** PNG com alpha recolorido para o gradiente do foil (source-in). */
function foilEmblemCanvas(img: HTMLImageElement, size: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  if (ctx) {
    const k = Math.min(size / img.width, size / img.height);
    const w = img.width * k;
    const h = img.height * k;
    ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
    ctx.globalCompositeOperation = "source-in";
    ctx.fillStyle = foilGradient(ctx, 0, 0, size, size);
    ctx.fillRect(0, 0, size, size);
    ctx.globalCompositeOperation = "source-over";
  }
  return c;
}

function fillTracked(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  trackPx: number,
  align: "center" | "left",
): void {
  const chars = Array.from(text);
  const ws = chars.map((c) => ctx.measureText(c).width);
  const total = ws.reduce((a, b) => a + b, 0) + trackPx * (chars.length - 1);
  let cx = align === "center" ? x - total / 2 : x;
  const prev = ctx.textAlign;
  ctx.textAlign = "left";
  chars.forEach((c, i) => {
    ctx.fillText(c, cx, y);
    cx += ws[i] + trackPx;
  });
  ctx.textAlign = prev;
}

function drawEmblemFallback(ctx: CanvasRenderingContext2D, S: number): void {
  const c = S / 2;
  ctx.clearRect(0, 0, S, S);
  ctx.strokeStyle = foilGradient(ctx, 0, 0, S, S);
  ctx.fillStyle = foilGradient(ctx, 0, 0, S, S);
  ctx.lineWidth = S * 0.006;
  ctx.beginPath();
  ctx.arc(c, c, S * 0.46, 0, Math.PI * 2);
  ctx.stroke();
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.font = `700 ${S * 0.2}px ${SERIF}`;
  ctx.fillText(">_", c, c);
}

// ---------- logo da tampa ----------
export interface LidLogo {
  mesh: THREE.Mesh;
  dispose: () => void;
}

export function createLidLogo(lidRadius: number, topY: number, onUpdate?: () => void): LidLogo {
  const S = 1024;
  const { ctx, tex } = makeCanvasTexture(S, S, 1);

  void loadEmblem().then((img) => {
    if (!ctx) return;
    ctx.clearRect(0, 0, S, S);
    if (img) ctx.drawImage(foilEmblemCanvas(img, S), 0, 0, S, S);
    else drawEmblemFallback(ctx, S);
    tex.needsUpdate = true;
    onUpdate?.();
  });

  const geo = new THREE.CircleGeometry(lidRadius * 0.88, 64);
  const mat = createFoilMaterial(tex);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = "LidLogo";
  mesh.position.set(0, topY + 0.003, 0);
  mesh.rotation.x = -Math.PI / 2;

  return {
    mesh,
    dispose: () => {
      geo.dispose();
      mat.dispose();
      tex.dispose();
    },
  };
}

// ---------- decals da caixa ----------
export interface BoxDecals {
  group: THREE.Group;
  materials: THREE.Material[]; // para animar a opacidade junto com a caixa
  dispose: () => void;
}

const FRONT_W = 1356;
const FRONT_H = 900;
const SIDE_W = 1416;
const SIDE_H = 900;

/** Frente (+z). Cap-height ≥ 14 px (DEEP WORK) e ≥ 11 px (marca) a 1440×900 na câmera do Hero. */
function drawFront(ctx: CanvasRenderingContext2D, emblem: HTMLCanvasElement | null): void {
  const W = FRONT_W;
  const H = FRONT_H;
  ctx.clearRect(0, 0, W, H);
  const foil = foilGradient(ctx, W * 0.12, H * 0.1, W * 0.88, H * 0.8);
  ctx.fillStyle = foil;
  ctx.strokeStyle = foil;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  const es = 200;
  const ey = 150;
  if (emblem) {
    ctx.drawImage(emblem, W / 2 - es / 2, ey - es / 2, es, es);
  } else {
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(W / 2, ey, es / 2.2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.font = `700 70px ${SERIF}`;
    ctx.fillText(">_", W / 2, ey);
  }

  ctx.font = `600 74px ${SERIF}`;
  fillTracked(ctx, BRAND, W / 2, 380, 10, "center");
  ctx.font = `500 40px ${SERIF}`;
  fillTracked(ctx, SLOGAN, W / 2, 470, 9, "center");
  ctx.font = `600 96px ${SERIF}`;
  fillTracked(ctx, "DEEP WORK", W / 2, 590, 18, "center");

  // Faixa bege + notas: só depois de as fotografias a confirmarem (BOX_DECALS.band)
  if (BOX_DECALS.band) {
    ctx.fillStyle = "#C9A06A";
    ctx.fillRect(0, H - 90, W, 90);
    ctx.fillStyle = "#0B0B0B";
    ctx.font = `600 28px ${SERIF}`;
    fillTracked(ctx, "BERGAMOT · CEDARWOOD · SANDALWOOD · AMBER · BLACK PEPPER", W / 2, H - 45, 3, "center");
  }
}

function drawIcon(ctx: CanvasRenderingContext2D, kind: number, cx: number, cy: number, r: number): void {
  ctx.beginPath();
  if (kind === 0) {
    ctx.moveTo(cx, cy - r);
    ctx.quadraticCurveTo(cx + r, cy - r * 0.2, cx, cy + r);
    ctx.quadraticCurveTo(cx - r, cy - r * 0.2, cx, cy - r);
  } else if (kind === 1) {
    ctx.moveTo(cx, cy - r);
    ctx.lineTo(cx + r * 0.85, cy + r * 0.5);
    ctx.lineTo(cx - r * 0.85, cy + r * 0.5);
    ctx.closePath();
    ctx.moveTo(cx, cy + r * 0.5);
    ctx.lineTo(cx, cy + r);
  } else if (kind === 2) {
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.rect(cx - r * 0.4, cy - r * 0.4, r * 0.8, r * 0.8);
  } else {
    ctx.moveTo(cx, cy + r);
    ctx.bezierCurveTo(cx - r * 1.6, cy - r * 0.2, cx - r * 0.6, cy - r * 1.2, cx, cy - r * 0.35);
    ctx.bezierCurveTo(cx + r * 0.6, cy - r * 1.2, cx + r * 1.6, cy - r * 0.2, cx, cy + r);
  }
  ctx.stroke();
}

const SIDE_ROWS: readonly (readonly [string, string])[] = [
  ["CLEAN BURNING", "NON-TOXIC INGREDIENTS"],
  ["PREMIUM FRAGRANCE", "HIGH QUALITY OILS"],
  ["WOOD WICK", "CRACKLING AMBIANCE"],
  ["HAND POURED", "SMALL BATCH"],
];
// Posições lidas da fotografia da caixa real (fração da face): linhas, coluna do ícone, início do texto
const SIDE_ROW_Y = [0.09, 0.29, 0.51, 0.69] as const;
const SIDE_ICON_X = 0.376;
const SIDE_TEXT_X = 0.43;
const SIDE_GLYPH_Y = 0.88;

/** Face lateral (+x), como na fotografia: ícones e `>_` em foil, títulos em branco-sujo. */
function drawSide(ctx: CanvasRenderingContext2D): void {
  const W = SIDE_W;
  const H = SIDE_H;
  ctx.clearRect(0, 0, W, H);
  const foil = foilGradient(ctx, W * 0.3, 0, W * 0.7, H);
  ctx.strokeStyle = foil;
  ctx.lineWidth = 5;
  ctx.textBaseline = "middle";
  SIDE_ROWS.forEach(([title, sub], i) => {
    const y = H * SIDE_ROW_Y[i];
    drawIcon(ctx, i, W * SIDE_ICON_X, y, 44);
    ctx.fillStyle = COLORS.fg;
    ctx.globalAlpha = 1;
    ctx.font = `600 38px ${SERIF}`;
    fillTracked(ctx, title, W * SIDE_TEXT_X, y - 20, 4, "left");
    ctx.globalAlpha = 0.8;
    ctx.font = `500 26px ${SERIF}`;
    fillTracked(ctx, sub, W * SIDE_TEXT_X, y + 26, 3, "left");
  });
  ctx.globalAlpha = 1;
  ctx.fillStyle = foil;
  ctx.font = `700 66px ${SERIF}`;
  ctx.textAlign = "left";
  ctx.fillText(">_", W * SIDE_TEXT_X, H * SIDE_GLYPH_Y);
}

/** Planos filhos do grupo da caixa (origem = centro da caixa). */
export function createBoxDecals(size: readonly [number, number, number], onUpdate?: () => void): BoxDecals {
  const [w, h, d] = size;
  const front = makeCanvasTexture(FRONT_W, FRONT_H);
  const side = makeCanvasTexture(SIDE_W, SIDE_H);

  if (front.ctx) drawFront(front.ctx, null);
  if (side.ctx) drawSide(side.ctx);
  front.tex.needsUpdate = true;
  side.tex.needsUpdate = true;

  void loadEmblem().then((img) => {
    if (!front.ctx) return;
    drawFront(front.ctx, img ? foilEmblemCanvas(img, 256) : null);
    front.tex.needsUpdate = true;
    onUpdate?.();
  });

  const frontMat = createFoilMaterial(front.tex);
  const sideMat = createFoilMaterial(side.tex);
  const frontGeo = new THREE.PlaneGeometry(w, h);
  const sideGeo = new THREE.PlaneGeometry(d, h);

  const frontMesh = new THREE.Mesh(frontGeo, frontMat);
  frontMesh.position.set(0, 0, d / 2 + 0.004);
  const sideMesh = new THREE.Mesh(sideGeo, sideMat);
  sideMesh.position.set(w / 2 + 0.004, 0, 0);
  sideMesh.rotation.y = Math.PI / 2;

  const group = new THREE.Group();
  group.name = "BoxDecals";
  group.add(frontMesh, sideMesh);

  return {
    group,
    materials: [frontMat, sideMat],
    dispose: () => {
      frontGeo.dispose();
      sideGeo.dispose();
      frontMat.dispose();
      sideMat.dispose();
      front.tex.dispose();
      side.tex.dispose();
    },
  };
}