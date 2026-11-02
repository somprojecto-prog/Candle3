"use client";

import type { MouseEvent, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { scrollToHash } from "@/lib/scrollTo";

interface ButtonProps {
  href: string;
  variant?: "primary" | "secondary";
  size?: "md" | "sm";
  className?: string;
  children: ReactNode;
}

const BASE =
  "inline-flex items-center justify-center rounded uppercase transition duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-gold";

const VARIANT = {
  primary:
    "bg-gold text-ink hover:scale-[1.02] hover:bg-gold-hi active:scale-[0.98] active:bg-gold-active",
  secondary:
    "border border-gold bg-transparent text-gold hover:scale-[1.02] hover:bg-gold/10 active:scale-[0.98]",
} as const;

const SIZE = {
  md: "px-8 py-4 text-btn",
  sm: "px-5 py-2.5 text-[0.8125rem] font-medium leading-none tracking-[0.02em]",
} as const;

export default function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: ButtonProps) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!href.startsWith("#")) return;
    if (href !== "#top" && !document.querySelector(href)) return;
    e.preventDefault();
    scrollToHash(href);
    history.replaceState(null, "", href);
  };

  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(BASE, VARIANT[variant], SIZE[size], className)}
    >
      {children}
    </a>
  );
}
