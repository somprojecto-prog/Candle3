"use client";

import { useEffect, useRef } from "react";
import { CODE, CHECKOUT_URL, SECTION_IDS } from "@/lib/constants";
import { EASE_CSS, STAGGER } from "@/lib/motion";
import { CLOSING } from "@/lib/content";
import Section from "@/components/ui/Section";
import Reveal from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";
import SystemLabel from "@/components/ui/SystemLabel";

export default function ClosingCTA() {
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = ctaRef.current;
    if (!wrap) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const btn = wrap.querySelector("a");
        btn?.animate(
          [
            { transform: "scale(1)" },
            { transform: "scale(1.03)" },
            { transform: "scale(1)" },
          ],
          { duration: 600, easing: EASE_CSS.out },
        );
      },
      { threshold: 0.6 },
    );
    io.observe(wrap);

    return () => io.disconnect();
  }, []);

  return (
    <Section id={SECTION_IDS.closing} tone="base">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <Reveal variant="label" className="mb-4">
          <SystemLabel>{CODE.closing}</SystemLabel>
        </Reveal>
        <Reveal as="h2" variant="blur" className="text-h1 text-fg">
          {CLOSING.title}
        </Reveal>
        <Reveal
          as="p"
          variant="line"
          delay={STAGGER.lines}
          className="mt-6 text-body text-muted"
        >
          {CLOSING.support}
        </Reveal>
        <Reveal delay={STAGGER.lines * 2} className="mt-10 flex flex-col items-center">
          <div ref={ctaRef}>
            <Button href={CHECKOUT_URL}>{CLOSING.cta}</Button>
          </div>
          <p className="mt-3 text-[0.875rem] text-muted">{CLOSING.price}</p>
        </Reveal>
      </div>
    </Section>
  );
}