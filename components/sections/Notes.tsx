import { CODE, SECTION_IDS } from "@/lib/constants";
import { NOTES } from "@/lib/content";
import StorySection from "@/components/story/StorySection";
import Reveal from "@/components/motion/Reveal";
import CodeComment from "@/components/ui/CodeComment";
import SpecList from "@/components/sections/SpecList";

export default function Notes() {
  return (
    <StorySection id={SECTION_IDS.notes} step="notes" tone="base">
      <div className="grid w-full items-center gap-10 md:grid-cols-12 md:gap-x-8">
        <div className="nostory:md:col-span-5 story:col-span-4">
          <Reveal>
            <CodeComment className="mb-4">{CODE.notes}</CodeComment>
            <h2 className="text-h2 text-fg">{NOTES.title}</h2>
          </Reveal>
          <Reveal delay={0.06} className="mt-6">
            <p className="max-w-[34ch] text-body text-muted">{NOTES.support}</p>
          </Reveal>
        </div>

        <div className="nostory:md:col-span-6 nostory:md:col-start-7 story:col-span-4 story:col-start-9">
          <SpecList items={NOTES.items} />
        </div>
      </div>
    </StorySection>
  );
}
