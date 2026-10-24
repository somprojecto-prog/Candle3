import { CODE } from "@/lib/constants";

export default function HeroComment() {
  return (
    <p
      data-hero-comment
      aria-hidden="true"
      className="select-none font-mono text-mono-md text-code"
    >
      {CODE.focus}
    </p>
  );
}
