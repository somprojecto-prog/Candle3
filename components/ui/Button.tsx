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
  "inline-flex items-center justify-center rounded text-btn uppercase transition duration-200 motion-reduce:hover:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold";

const VARIANT = {
  primary: "bg-gold text-ink hover:-translate-y-px hover:bg-gold-hi",
  secondary:
    "border border-gold bg-transparent text-gold hover:-translate-y-px hover:bg-gold/10",
} as const;

const SIZE = {
  md: "h-[52px] px-8",
  sm: "h-10 px-5",
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
