import { CODE } from "@/lib/constants";

const LABEL = "col-start-1 row-start-1 select-none font-mono text-label text-code";

export default function HeroLabel() {
  return (
    <div className="grid">
      <p aria-hidden="true" data-hero-label-init className={LABEL}>
        {CODE.init}
      </p>
      <p aria-hidden="true" data-hero-label-focus className={LABEL}>
        {CODE.focus}
      </p>
    </div>
  );
}
