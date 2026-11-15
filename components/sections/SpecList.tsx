import Reveal from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";

interface SpecListProps {
  items: readonly string[];
  className?: string;
}

export default function SpecList({ items, className }: SpecListProps) {
  return (
    <ul className={cn("border-t border-line", className)}>
      {items.map((item, i) => (
        <Reveal
          key={item}
          as="li"
          variant="line"
          delay={Math.min(i * 0.06, 0.24)}
          className="flex items-center gap-4 border-b border-line py-4 font-display text-[clamp(1.375rem,1.1rem+1vw,1.75rem)] leading-tight text-fg"
        >
          <span aria-hidden className="shrink-0 text-code">
            –
          </span>
          {item}
        </Reveal>
      ))}
    </ul>
  );
}