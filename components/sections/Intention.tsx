import { CODE, SECTION_IDS } from "@/lib/constants";
import { STAGGER } from "@/lib/motion";
import { INTENTION } from "@/lib/content";
import StorySection from "@/components/story/StorySection";
import ProductSlot from "@/components/story/ProductSlot";
import Reveal from "@/components/motion/Reveal";
import SystemLabel from "@/components/ui/SystemLabel";

export default function Intention() {
  return (
    <StorySection id={SECTION_IDS.about} step="intention" tone="raised">
      <div className="grid w-full items-center gap-10 lg:grid-cols-12 lg:gap-x-8">
        <div className="order-1 lg:order-2 lg:col-span-6 lg:col-start-7">
          <Reveal variant="label" className="mb-4">
            <SystemLabel>{CODE.intention}</SystemLabel>
          </Reveal>
          <Reveal as="h2" className="text-h1 text-fg">
            {INTENTION.title}
          </Reveal>
          <ul className="mt-8 md:mt-10">
            {INTENTION.items.map((item, i) => (
              <Reveal
                key={item}
                as="li"
                variant="line"
                delay={i * STAGGER.list}
                className="flex items-center gap-4 py-3 text-body text-fg"
              >
                <span aria-hidden className="text-code">
                  –
                </span>
                {item}
              </Reveal>
            ))}
          </ul>
        </div>

        <div className="order-2 h-[48svh] lg:order-1 lg:col-span-6 lg:col-start-1 lg:h-[min(64svh,600px)]">
          <ProductSlot view="intention" className="h-full w-full" />
        </div>
      </div>
    </StorySection>
  );
}