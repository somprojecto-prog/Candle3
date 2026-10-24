import { CODE, SECTION_IDS } from "@/lib/constants";
import { STATEMENT } from "@/lib/content";
import StorySection from "@/components/story/StorySection";
import ProductSlot from "@/components/story/ProductSlot";
import Reveal from "@/components/motion/Reveal";
import CodeComment from "@/components/ui/CodeComment";

export default function ProductStatement() {
  return (
    <StorySection id={SECTION_IDS.product} step="reveal" tone="base">
      <div className="grid w-full items-center gap-10 md:grid-cols-12 md:gap-x-8">
        <div className="order-1 nostory:md:col-span-6 story:col-span-5">
          <Reveal>
            <CodeComment className="mb-4">{CODE.statement}</CodeComment>
            <h2 className="text-h2 text-fg">{STATEMENT.title}</h2>
          </Reveal>
          <Reveal delay={0.06} className="mt-6">
            <p className="max-w-[40ch] text-body text-muted">{STATEMENT.positioning}</p>
          </Reveal>
          <Reveal delay={0.12} className="mt-8">
            <p className="text-body text-fg">{STATEMENT.support}</p>
          </Reveal>
        </div>

        <div className="order-2 h-[48svh] md:h-[min(64svh,600px)] nostory:md:col-span-6 story:col-span-6 story:col-start-7">
          <ProductSlot view="statement" className="h-full w-full" />
        </div>
      </div>
    </StorySection>
  );
}
