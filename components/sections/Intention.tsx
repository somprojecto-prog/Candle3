import { CODE, REVEAL, SECTION_IDS } from "@/lib/constants";
import { INTENTION } from "@/lib/content";
import StorySection from "@/components/story/StorySection";
import ProductSlot from "@/components/story/ProductSlot";
import Reveal from "@/components/motion/Reveal";
import CodeComment from "@/components/ui/CodeComment";
import SpecList from "@/components/sections/SpecList";

export default function Intention() {
  return (
    <StorySection id={SECTION_IDS.about} step="intention" tone="raised">
      <div className="grid w-full items-center gap-10 md:grid-cols-12 md:gap-x-8">
        <div className="order-1 md:order-2 md:col-span-6 md:col-start-7">
          <Reveal variant="label" delay={REVEAL.codeDelay} className="mb-4">
            <CodeComment>{CODE.intention}</CodeComment>
          </Reveal>
          <Reveal
            as="h2"
            className="text-[clamp(2rem,1.2rem+2.6vw,3.5rem)] font-medium leading-[1.1] tracking-[-0.01em] text-fg"
          >
            {INTENTION.title}
          </Reveal>
          <SpecList items={INTENTION.items} className="mt-8 md:mt-10" />
        </div>

        <div className="order-2 h-[48svh] md:order-1 md:col-span-6 md:h-[min(64svh,600px)]">
          <ProductSlot view="intention" className="h-full w-full" />
        </div>
      </div>
    </StorySection>
  );
}