import { SECTION_IDS } from "@/lib/constants";

export const STORY_STEPS = ["hero", "reveal", "intention", "notes", "offer"] as const;
export type StoryStep = (typeof STORY_STEPS)[number];

export const STORY_SECTION_IDS = [
  SECTION_IDS.top,
  SECTION_IDS.product,
  SECTION_IDS.about,
  SECTION_IDS.notes,
  SECTION_IDS.offer,
] as const;

export const STORY_SECTION_VH: Record<StoryStep, number> = {
  hero: 150,
  reveal: 150,
  intention: 150,
  notes: 145,
  offer: 140,
};

/** Onde o ponto-alvo da câmera aparece na tela (x da esquerda, y do topo; 0..1). */
export const STORY_FOCUS = [
  [0.72, 0.52], // 0 hero: produto à direita
  [0.7, 0.52], // 1 reveal: texto cols 1–5, produto à direita
  [0.3, 0.54], // 2 intention: produto à esquerda, texto cols 7–12
  [0.5, 0.5], // 3 notes: produto ao centro, título à esquerda e lista à direita
  [0.71, 0.52], // 4 offer: detalhes cols 1–5, produto à direita
] as const satisfies readonly (readonly [number, number])[];

/** Mobile: produto centrado na metade de baixo. */
export const STORY_FOCUS_MOBILE: readonly (readonly [number, number])[] = STORY_FOCUS.map(
  () => [0.5, 0.72] as const,
);

export interface StoryState {
  phase: number; // 0..4 contínuo (inteiro = passo em repouso)
  /** 0..1 progresso do scroll dentro da secção do passo "reveal" (0 antes, 1 depois). */
  reveal: number;
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