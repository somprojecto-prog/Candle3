"use client";

import type { MouseEvent, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { scrollToHash } from "@/lib/scrollTo";

interface ButtonProps {
  href: string;
  variant?: "primary" | "secondary";
  size?: "md" | "sm" | "lg";
  className?: string;
  children: ReactNode;
}

const BASE =
  "inline-flex items-center justify-center rounded text-btn uppercase transition-[transform,background-color,box-shadow] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02] active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-gold";

const VARIANT = {
  primary: "bg-gold text-ink hover:bg-gold-hi active:bg-gold-active",
  secondary:
    "border border-gold bg-transparent text-gold hover:bg-gold/10 active:bg-gold/10",
} as const;

const SIZE = {
  md: "h-[52px] px-8",
  sm: "h-10 px-5",
  lg: "h-14 px-10 hover:shadow-[0_8px_28px_rgba(201,168,76,0.22)] motion-reduce:hover:shadow-none",
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