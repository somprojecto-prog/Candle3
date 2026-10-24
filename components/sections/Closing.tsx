import { CODE, CHECKOUT_URL, SECTION_IDS } from "@/lib/constants";
import { CLOSING } from "@/lib/content";
import Section from "@/components/ui/Section";
import Reveal from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";
import CodeComment from "@/components/ui/CodeComment";

export default function Closing() {
  return (
    <Section id={SECTION_IDS.closing} tone="base">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <Reveal>
          <CodeComment className="mb-4">{CODE.closing}</CodeComment>
          <h2 className="text-h1 text-fg">{CLOSING.title}</h2>
        </Reveal>
        <Reveal delay={0.06} className="mt-6">
          <p className="text-body text-muted">{CLOSING.support}</p>
        </Reveal>
        <Reveal delay={0.12} className="mt-10">
          <Button href={CHECKOUT_URL}>{CLOSING.cta}</Button>
        </Reveal>
      </div>
    </Section>
  );
}
