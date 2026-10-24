import { CODE, SECTION_IDS } from "@/lib/constants";
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
        <div className="order-1 md:order-2 nostory:md:col-span-6 story:col-span-5 story:col-start-8">
          <Reveal>
            <CodeComment className="mb-4">{CODE.intention}</CodeComment>
            <h2 className="text-h2 text-fg">{INTENTION.title}</h2>
          </Reveal>
          <SpecList items={INTENTION.items} className="mt-10" />
        </div>

        <div className="order-2 h-[48svh] md:order-1 md:h-[min(64svh,600px)] nostory:md:col-span-6 story:col-span-6">
          <ProductSlot view="intention" className="h-full w-full" />
        </div>
      </div>
    </StorySection>
  );
}
