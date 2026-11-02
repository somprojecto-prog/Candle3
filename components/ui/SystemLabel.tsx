import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SystemLabelProps {
  children: ReactNode;
  className?: string;
}

export default function SystemLabel({ children, className }: SystemLabelProps) {
  return (
    <p aria-hidden className={cn("select-none font-mono text-label text-code", className)}>
      {children}
    </p>
  );
}
