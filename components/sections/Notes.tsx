import { CODE, SECTION_IDS } from "@/lib/constants";
import { STAGGER } from "@/lib/motion";
import { NOTES } from "@/lib/content";
import StorySection from "@/components/story/StorySection";
import Reveal from "@/components/motion/Reveal";
import SystemLabel from "@/components/ui/SystemLabel";
import NoteItem from "@/components/ui/NoteItem";

export default function Notes() {
  return (
    <StorySection id={SECTION_IDS.notes} step="notes" tone="base">
      <div className="grid w-full items-center gap-10 lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-5">
          <Reveal variant="label" className="mb-4">
            <SystemLabel>{CODE.notes}</SystemLabel>
          </Reveal>
          <Reveal as="h2" className="text-h1 text-fg">
            {NOTES.title}
          </Reveal>
          <Reveal
            as="p"
            variant="line"
            delay={STAGGER.lines}
            className="mt-6 max-w-[34ch] text-body text-muted"
          >
            {NOTES.support}
          </Reveal>
        </div>

        <ul className="border-b border-line lg:col-span-6 lg:col-start-7">
          {NOTES.items.map((note, i) => (
            <NoteItem
              key={note.name}
              name={note.name}
              description={note.description}
              delay={i * STAGGER.notes}
            />
          ))}
        </ul>
      </div>
    </StorySection>
  );
}