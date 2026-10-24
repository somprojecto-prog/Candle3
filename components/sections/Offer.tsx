import { CHECKOUT_URL, SECTION_IDS } from "@/lib/constants";
import { OFFER } from "@/lib/content";
import StorySection from "@/components/story/StorySection";
import ProductSlot from "@/components/story/ProductSlot";
import Reveal from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";
import SpecList from "@/components/sections/SpecList";

export default function Offer() {
  return (
    <StorySection id={SECTION_IDS.offer} step="offer" tone="raised">
      <div className="grid w-full items-center gap-10 md:grid-cols-12 md:gap-x-8">
        <div className="order-1 nostory:md:col-span-6 story:col-span-5">
          <Reveal>
            <h2 className="text-h2 text-fg">{OFFER.title}</h2>
          </Reveal>
          <Reveal delay={0.06} className="mt-6">
            <p className="font-display text-[clamp(2.75rem,1.8rem+3vw,4rem)] leading-none text-fg">
              <span className="sr-only">Price: </span>
              {OFFER.price}
            </p>
          </Reveal>
          <SpecList items={OFFER.info} columns={2} className="mt-10" />
          <Reveal delay={0.18} className="mt-10">
            <Button href={CHECKOUT_URL} className="w-full sm:w-auto sm:min-w-[280px]">
              {OFFER.cta}
            </Button>
          </Reveal>
        </div>

        <div className="order-2 h-[48svh] md:h-[min(64svh,600px)] nostory:md:col-span-6 story:col-span-6 story:col-start-7">
          <ProductSlot view="offer" className="h-full w-full" />
        </div>
      </div>
    </StorySection>
  );
}
