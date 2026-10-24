"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import {
  HERO_DONE_EVENT,
  heroElapsed,
  isHeroPlaying,
  titleStateAt,
} from "@/lib/heroIntro";

interface HeroTitleProps {
  text: string;
  className?: string;
}

export default function HeroTitle({ text, className }: HeroTitleProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isHeroPlaying()) return;

    let raf = 0;
    let stopped = false;
    let lastChars = -1;
    let lastCursor: boolean | null = null;

    const stop = () => {
      stopped = true;
      cancelAnimationFrame(raf);
    };

    const tick = () => {
      if (stopped) return;
      if (!isHeroPlaying()) {
        stop();
        return;
      }
      const s = titleStateAt(heroElapsed(), text.length);
      if (s.chars !== lastChars && textRef.current) {
        textRef.current.textContent = text.slice(0, s.chars);
        lastChars = s.chars;
      }
      if (s.cursor !== lastCursor && cursorRef.current) {
        cursorRef.current.style.visibility = s.cursor ? "visible" : "hidden";
        lastCursor = s.cursor;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener(HERO_DONE_EVENT, stop, { once: true });
    tick();

    return () => {
      stop();
      window.removeEventListener(HERO_DONE_EVENT, stop);
    };
  }, [text]);

  return (
    <h1 className={cn("relative", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" data-hero-title-full>
        {text}
      </span>
      <span
        aria-hidden="true"
        data-hero-title-typed
        className="absolute inset-0 whitespace-pre"
      >
        <span ref={textRef} />
        <span ref={cursorRef} className="hero-cursor" />
      </span>
    </h1>
  );
}
