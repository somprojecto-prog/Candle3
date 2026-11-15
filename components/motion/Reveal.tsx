"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { REVEAL } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type RevealVariant = "default" | "line" | "label";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  variant?: RevealVariant;
  as?: ElementType;
  className?: string;
}

const Y: Record<RevealVariant, number> = {
  default: REVEAL.y,
  line: 12,
  label: REVEAL.labelY,
};

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

      let tween: gsap.core.Tween | null = null;

      const show = () => {
        gsap.set(el, { opacity: 1, y: 0 });
      };

      try {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const rect = el.getBoundingClientRect();

        if (reduced || rect.bottom < 0) {
          show();
        } else {
          const from: gsap.TweenVars = { opacity: 0, y: Y[variant] };
          const to: gsap.TweenVars = {
            opacity: 1,
            y: 0,
            duration: variant === "label" ? REVEAL.labelDuration : REVEAL.duration,
            ease: REVEAL.ease,
            delay,
          };

          if (rect.top < window.innerHeight * 0.88) {
            tween = gsap.fromTo(el, from, to);
          } else {
            tween = gsap.fromTo(el, from, {
              ...to,
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            });
          }
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