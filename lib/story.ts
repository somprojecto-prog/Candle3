import { SECTION_IDS } from "@/lib/constants";

export const STORY_STEPS = ["hero", "reveal", "statement", "intention", "notes", "specs"] as const;
export type StoryStep = (typeof STORY_STEPS)[number];

export const STORY_SECTION_IDS = [
  SECTION_IDS.top,
  SECTION_IDS.product,
  SECTION_IDS.statement,
  SECTION_IDS.about,
  SECTION_IDS.notes,
  SECTION_IDS.offer,
] as const;

/** Altura mínima (svh) de cada secção em modo "on". ProductReveal é longa: o scroll dentro dela dirige a abertura. */
export const STORY_SECTION_VH: Record<StoryStep, number> = {
  hero: 120,
  reveal: 320,
  statement: 110,
  intention: 140,
  notes: 120,
  specs: 130,
};

/** Referência (B implementa a transição): 1 = produto visível, 0 = oculto. */
export const STORY_PRODUCT_VISIBLE = [1, 1, 0, 1, 0, 1] as const;

/** Onde o ponto-alvo da câmera aparece na tela (x da esquerda, y do topo; 0..1). Desktop. */
export const STORY_FOCUS = [
  [0.744, 0.52], // 0 hero: centro da coluna direita (grid 55/45)
  [0.5, 0.52], // 1 reveal: centrado
  [0.5, 0.52], // 2 statement: oculto (mantém posição)
  [0.3, 0.54], // 3 intention: produto à esquerda, parcialmente cortado
  [0.3, 0.54], // 4 notes: oculto (mantém posição)
  [0.3, 0.52], // 5 specs: produto à esquerda
] as const satisfies readonly (readonly [number, number])[];

/** Mobile (<768px): texto no topo, produto na metade de baixo. */
export const STORY_FOCUS_MOBILE = [
  [0.5, 0.74],
  [0.5, 0.55],
  [0.5, 0.55],
  [0.5, 0.74],
  [0.5, 0.74],
  [0.5, 0.74],
] as const satisfies readonly (readonly [number, number])[];

export interface StoryState {
  phase: number; // 0..5 contínuo (inteiro = passo em repouso; fração = transição suavizada pelo A)
  reveal: number; // 0..1 progresso do scroll DENTRO da secção ProductReveal (0 antes dela, 1 depois)
  active: boolean;
}

export const storyState: StoryState = { phase: 0, reveal: 0, active: false };
export function resetStoryState(): void {
  storyState.phase = 0;
  storyState.reveal = 0;
  storyState.active = false;
}

export type StoryMode = "on" | "off";
let mode: StoryMode = "off";
const listeners = new Set<() => void>();
export const getStoryMode = (): StoryMode => mode;
export const getServerStoryMode = (): StoryMode => "off";
export function setStoryMode(next: StoryMode): void {
  if (next === mode) return;
  mode = next;
  listeners.forEach((l) => l());
}
export function subscribeStoryMode(l: () => void): () => void {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export const STORY_FAIL_EVENT = "story:fail";
export function failStory(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem("story:failed", "1");
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(STORY_FAIL_EVENT));
}
