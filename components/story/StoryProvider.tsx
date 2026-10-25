"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { STORY_MIN_WIDTH } from "@/lib/constants";
import {
  getStoryMode,
  setStoryMode,
  STORY_FAIL_EVENT,
  type StoryMode,
} from "@/lib/story";
import StoryStage from "@/components/story/StoryStage";
import { useStoryScroll } from "@/components/story/useStoryScroll";

gsap.registerPlugin(ScrollTrigger);

const FAIL_KEY = "story:failed";
const DEV = process.env.NODE_ENV !== "production";

let webglCache: boolean | null = null;
function hasWebGL(): boolean {
  if (webglCache !== null) return webglCache;
  try {
    const canvas = document.createElement("canvas");
    webglCache = Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    webglCache = false;
  }
  return webglCache;
}

function storedFailure(): boolean {
  try {
    return sessionStorage.getItem(FAIL_KEY) === "1";
  } catch {
    return false;
  }
}

function computeMode(failedState: boolean): StoryMode {
  if (DEV) {
    const forced = new URLSearchParams(window.location.search).get("story");
    if (forced === "on" || forced === "off") return forced;
  }
  const width = window.innerWidth;
  const webgl = hasWebGL();
  const failed = failedState || storedFailure();
  const on = width >= STORY_MIN_WIDTH && webgl && !failed;
  if (!on && DEV) {
    console.info("[story] off:", { width, webgl, failed });
  }
  return on ? "on" : "off";
}

export default function StoryProvider({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const onFail = () => setFailed(true);
    window.addEventListener(STORY_FAIL_EVENT, onFail);
    return () => window.removeEventListener(STORY_FAIL_EVENT, onFail);
  }, []);

  useEffect(() => {
    const mqWidth =
      STORY_MIN_WIDTH > 0
        ? window.matchMedia(`(min-width: ${STORY_MIN_WIDTH}px)`)
        : null;
    let raf = 0;

    const apply = () => {
      const next = computeMode(failed);
      document.documentElement.dataset.story = next;
      if (next !== getStoryMode()) {
        setStoryMode(next);
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => ScrollTrigger.refresh());
      }
    };

    apply();
    mqWidth?.addEventListener("change", apply);

    return () => {
      cancelAnimationFrame(raf);
      mqWidth?.removeEventListener("change", apply);
    };
  }, [failed]);

  useStoryScroll(rootRef);

  return (
    <div ref={rootRef} data-story-root className="relative">
      <StoryStage />
      {children}
    </div>
  );
}
