"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import { EASE_CSS } from "@/lib/motion";
import Reveal from "@/components/motion/Reveal";

interface NoteItemProps {
  name: string;
  description: string;
  delay?: number;
}

export default function NoteItem({ name, description, delay = 0 }: NoteItemProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <Reveal as="li" variant="line" delay={delay} className="group">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="block w-full border-t border-line py-5 text-left"
      >
        <span
          className={cn(
            "block font-display text-h3 transition-colors duration-200 motion-reduce:transition-none",
            open ? "text-gold" : "text-fg",
            "[@media(hover:hover)]:group-hover:text-gold group-has-[:focus-visible]:text-gold",
          )}
        >
          {name}
        </span>
      </button>

      <div
        id={panelId}
        aria-hidden={!open}
        style={{ transitionTimingFunction: EASE_CSS.out }}
        className={cn(
          "grid transition-[grid-template-rows] duration-[250ms] motion-reduce:transition-none",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          "[@media(hover:hover)]:group-hover:grid-rows-[1fr] group-has-[:focus-visible]:grid-rows-[1fr]",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <p className="pb-5 text-small text-muted">{description}</p>
        </div>
      </div>
    </Reveal>
  );
}