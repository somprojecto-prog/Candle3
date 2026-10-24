"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

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

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const rect = el.getBoundingClientRect();

      if (reduced || rect.bottom < 0) {
        gsap.set(el, { opacity: 1, y: 0 });
        return;
      }

      const vars = { opacity: 1, y: 0, duration: 0.45, delay, ease: "power3.out" };

      if (rect.top < window.innerHeight * 0.88) {
        gsap.fromTo(el, { opacity: 0, y: 16 }, vars);
        return;
      }

      gsap.fromTo(el, { opacity: 0, y: 16 }, {
        ...vars,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} data-reveal className={className}>
      {children}
    </Tag>
  );
}
