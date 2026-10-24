import Reveal from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";

interface SpecListProps {
  items: readonly string[];
  columns?: 1 | 2;
  className?: string;
}

export default function SpecList({ items, columns = 1, className }: SpecListProps) {
  return (
    <ul
      className={cn(
        "border-t border-line",
        columns === 2 && "grid sm:grid-cols-2 sm:gap-x-8",
        className
      )}
    >
      {items.map((item, i) => (
        <Reveal
          key={item}
          as="li"
          delay={Math.min(i * 0.06, 0.24)}
          className="flex items-center gap-4 border-b border-line py-4 text-body text-fg"
        >
          <span aria-hidden className="h-px w-3 shrink-0 bg-gold" />
          {item}
        </Reveal>
      ))}
    </ul>
  );
}
