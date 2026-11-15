import { SECTION_IDS, SHOP_URL } from "@/lib/constants";
import { HERO } from "@/lib/content";
import StorySection from "@/components/story/StorySection";
import ProductSlot from "@/components/story/ProductSlot";
import Button from "@/components/ui/Button";
import HeroLabel from "@/components/hero/HeroLabel";

export default function Hero() {
  return (
    <StorySection id={SECTION_IDS.top} step="hero" flush fill divider={false}>
      <div className="grid w-full items-center gap-8 py-8 lg:grid-cols-[5fr_7fr] lg:gap-x-8 lg:py-0">
        <div className="order-1">
          <HeroLabel />
          <h1 data-hero-headline className="mt-6 text-display text-fg">
            {HERO.title}
          </h1>
          <p data-hero-sub className="mt-6 max-w-[420px] text-body text-muted">
            {HERO.subtitle}
          </p>
          <div data-hero-cta className="mt-8">
            <Button href={SHOP_URL} className="w-full sm:w-auto">
              {HERO.cta}
            </Button>
          </div>
        </div>

        <div
          data-hero-product
          className="order-2 h-[55svh] lg:h-[min(720px,76vh)]"
        >
          <ProductSlot view="hero" priority className="h-full w-full" />
        </div>
      </div>
    </StorySection>
  );
}