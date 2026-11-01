"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { REVEAL } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface RevealProps {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
}

export default function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const show = () => {
        gsap.set(el, { opacity: 1, y: 0 });
      };

      try {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const rect = el.getBoundingClientRect();

        if (reduced || rect.bottom < 0) {
          show();
          return;
        }

        const from = { opacity: 0, y: REVEAL.y };
        const to = {
          opacity: 1,
          y: 0,
          duration: REVEAL.duration,
          ease: REVEAL.ease,
          delay,
        };

        if (rect.top < window.innerHeight * 0.88) {
          gsap.fromTo(el, from, to);
          return;
        }

        gsap.fromTo(el, from, {
          ...to,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      } catch {
        show();
      }
    },
    { scope: ref, dependencies: [delay] },
  );

  return (
    <Tag ref={ref} data-reveal className={className}>
      {children}
    </Tag>
  );
}
