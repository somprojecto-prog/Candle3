import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface CodeCommentProps {
  children: ReactNode;
  className?: string;
}

export default function CodeComment({ children, className }: CodeCommentProps) {
  return (
    <p
      aria-hidden="true"
      className={cn("select-none font-mono text-mono-sm text-code", className)}
    >
      {children}
    </p>
  );
}
