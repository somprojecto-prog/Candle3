"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  DUR,
  EASE_GSAP,
  REVEAL_Y,
  SCROLL,
  type RevealVariant,
} from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface RevealProps {
  children: ReactNode;
  delay?: number;
  variant?: RevealVariant;
  as?: ElementType;
  className?: string;
}

/** Fração da viewport equivalente a SCROLL.start ("top 80%"). */
const START_RATIO = 0.8;

export default function Reveal({
  children,
  delay = 0,
  variant = "default",
  as: Tag = "div",
  className,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const isBlur = variant === "blur";
      const isLabel = variant === "label";

      const show = () => {
        gsap.set(el, { opacity: 1, y: 0, ...(isBlur ? { filter: "none" } : {}) });
      };

      let tween: gsap.core.Tween | null = null;

      try {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const rect = el.getBoundingClientRect();

        if (reduced || rect.bottom < 0) {
          show();
          return;
        }

        const from: gsap.TweenVars = {
          opacity: 0,
          y: REVEAL_Y[variant],
          ...(isBlur ? { filter: "blur(8px)" } : {}),
        };

        const to: gsap.TweenVars = {
          opacity: 1,
          y: 0,
          duration: isLabel ? DUR.label : DUR.base,
          ease: isLabel ? EASE_GSAP.out : EASE_GSAP.text,
          delay,
          ...(isBlur
            ? {
                filter: "blur(0px)",
                onComplete: () => {
                  gsap.set(el, { filter: "none" });
                },
              }
            : {}),
        };

        if (rect.top < window.innerHeight * START_RATIO) {
          tween = gsap.fromTo(el, from, to);
        } else {
          tween = gsap.fromTo(el, from, {
            ...to,
            scrollTrigger: { trigger: el, start: SCROLL.start, once: true },
          });
        }
      } catch {
        show();
      }

      return () => {
        tween?.scrollTrigger?.kill();
        tween?.kill();
      };
    },
    { scope: ref, dependencies: [delay, variant] },
  );

  return (
    <Tag ref={ref} data-reveal={variant} className={className}>
      {children}
    </Tag>
  );
}