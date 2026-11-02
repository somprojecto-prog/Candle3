import { CHECKOUT_URL, SECTION_IDS } from "@/lib/constants";
import { STAGGER } from "@/lib/motion";
import { SPECS } from "@/lib/content";
import StorySection from "@/components/story/StorySection";
import ProductSlot from "@/components/story/ProductSlot";
import Reveal from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";

export default function ProductSpecs() {
  return (
    <StorySection id={SECTION_IDS.offer} step="specs" tone="raised">
      <div className="grid w-full items-center gap-8 lg:grid-cols-12 lg:gap-x-8">
        <div className="order-1 lg:order-2 lg:col-span-6 lg:col-start-7">
          <Reveal as="h2" className="text-h2 text-fg">
            {SPECS.title}
          </Reveal>

          <Reveal
            as="p"
            delay={STAGGER.lines}
            className="mt-[clamp(0.5rem,1.4svh,1rem)] font-display text-[clamp(2.75rem,2rem+2.2vw,4rem)] font-medium leading-none text-fg"
          >
            <span className="sr-only">Price: </span>
            {SPECS.price}
          </Reveal>

          <Reveal
            as="p"
            variant="line"
            delay={STAGGER.lines * 2}
            className="mt-[clamp(0.5rem,1.4svh,1rem)] text-body text-muted"
          >
            {SPECS.summary}
          </Reveal>

          <ul className="mt-[clamp(1rem,2.4svh,2rem)] grid grid-cols-2 gap-x-8">
            {SPECS.items.map((item, i) => (
              <Reveal
                key={item}
                as="li"
                variant="line"
                delay={i * STAGGER.list}
                className="border-t border-line py-[clamp(0.5rem,1.6svh,1rem)] text-body text-fg"
              >
                {item}
              </Reveal>
            ))}
          </ul>

          <Reveal className="mt-[clamp(1rem,2.4svh,2rem)]">
            <Button href={CHECKOUT_URL} className="w-full sm:w-auto sm:min-w-[280px]">
              {SPECS.cta}
            </Button>
          </Reveal>

          <Reveal variant="line" className="mt-[clamp(0.75rem,1.8svh,1.5rem)]">
            {SPECS.support.map((line) => (
              <p key={line} className="text-micro text-muted">
                {line}
              </p>
            ))}
          </Reveal>
        </div>

        <div className="order-2 h-[48svh] lg:order-1 lg:col-span-6 lg:col-start-1 lg:h-[min(64svh,600px)]">
          <ProductSlot view="offer" className="h-full w-full" />
        </div>
      </div>
    </StorySection>
  );
}