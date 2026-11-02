import { CODE, SECTION_IDS } from "@/lib/constants";
import { STAGGER } from "@/lib/motion";
import { STATEMENT } from "@/lib/content";
import StorySection from "@/components/story/StorySection";
import Reveal from "@/components/motion/Reveal";
import SystemLabel from "@/components/ui/SystemLabel";

export default function Statement() {
  return (
    <StorySection id={SECTION_IDS.statement} step="statement" tone="base">
      <div className="grid w-full gap-10 lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-7">
          <Reveal variant="label" className="mb-4">
            <SystemLabel>{CODE.statement}</SystemLabel>
          </Reveal>
          <Reveal as="h2" className="text-h1 text-fg">
            {STATEMENT.title}
          </Reveal>
          <Reveal
            as="p"
            variant="line"
            delay={STAGGER.lines}
            className="mt-6 max-w-[48ch] text-body text-muted"
          >
            {STATEMENT.positioning}
          </Reveal>
          <Reveal
            as="p"
            variant="line"
            delay={STAGGER.lines * 2}
            className="mt-8 text-body text-fg"
          >
            {STATEMENT.support}
          </Reveal>
        </div>
      </div>
    </StorySection>
  );
}