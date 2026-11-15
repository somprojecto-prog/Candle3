import { CODE, REVEAL, SECTION_IDS } from "@/lib/constants";
import { NOTES } from "@/lib/content";
import StorySection from "@/components/story/StorySection";
import Reveal from "@/components/motion/Reveal";
import CodeComment from "@/components/ui/CodeComment";

export default function Notes() {
  return (
    <StorySection id={SECTION_IDS.notes} step="notes" tone="base">
      <div className="grid w-full items-center gap-8 md:grid-cols-12 md:gap-x-8 md:gap-y-10">
        <div className="nostory:md:col-span-5 story:col-span-4">
          <Reveal variant="label" delay={REVEAL.codeDelay} className="mb-4">
            <CodeComment>{CODE.notes}</CodeComment>
          </Reveal>
          <Reveal as="h2" className="text-h2 text-fg">
            {NOTES.title}
          </Reveal>
          <Reveal as="p" variant="line" delay={0.06} className="mt-6 max-w-[28ch] text-body text-muted">
            {NOTES.support}
          </Reveal>
        </div>

        <ul className="nostory:md:col-span-6 nostory:md:col-start-7 story:col-span-4 story:col-start-9">
          {NOTES.items.map((note, i) => (
            <Reveal
              key={note.name}
              as="li"
              variant="line"
              delay={i * 0.05}
              className="border-t border-line py-4 last:border-b md:py-5"
            >
              <span className="block font-display text-[clamp(1.75rem,1.2rem+1.8vw,2.75rem)] leading-tight text-fg">
                {note.name}
              </span>
              <span className="mt-1 block text-body text-muted">{note.description}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </StorySection>
  );
}