import { CHECKOUT_URL, SECTION_IDS } from "@/lib/constants";
import { OFFER } from "@/lib/content";
import StorySection from "@/components/story/StorySection";
import ProductSlot from "@/components/story/ProductSlot";
import Reveal from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";

function Sep() {
  return (
    <span aria-hidden className="mx-2 text-code">
      ·
    </span>
  );
}

export default function Offer() {
  return (
    <StorySection id={SECTION_IDS.offer} step="offer" tone="raised">
      <div className="grid w-full items-center gap-10 md:grid-cols-12 md:gap-x-8">
        <div className="order-1 nostory:md:col-span-6 story:col-span-5">
          <Reveal as="h2" className="text-h2 text-fg">
            {OFFER.title}
          </Reveal>

          <Reveal
            as="p"
            delay={0.06}
            className="mt-6 font-display text-[clamp(3.25rem,2.4rem+3vw,5rem)] leading-none tracking-[-0.02em] text-fg"
          >
            <span className="sr-only">Price: </span>
            {OFFER.price}
          </Reveal>

          <Reveal as="p" variant="line" delay={0.12} className="mt-5 text-body text-fg">
            {OFFER.info.map((item, i) => (
              <span key={item}>
                {i > 0 && <Sep />}
                {item}
              </span>
            ))}
          </Reveal>

          <Reveal delay={0.18} className="mt-10">
            <Button
              href={CHECKOUT_URL}
              size="lg"
              className="w-full sm:w-auto sm:min-w-[300px]"
            >
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