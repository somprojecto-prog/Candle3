import { SECTION_IDS, SHOP_URL } from "@/lib/constants";
import { HERO } from "@/lib/content";
import StorySection from "@/components/story/StorySection";
import ProductSlot from "@/components/story/ProductSlot";
import Button from "@/components/ui/Button";
import HeroComment from "@/components/hero/HeroComment";
import HeroTitle from "@/components/hero/HeroTitle";
import ScrollIndicator from "@/components/sections/ScrollIndicator";

export default function Hero() {
  return (
    <StorySection id={SECTION_IDS.top} step="hero" flush fill divider={false}>
      <div className="grid w-full items-center gap-8 py-10 md:grid-cols-12 md:gap-x-8 md:py-0">
        <div className="order-1 nostory:md:col-span-6 story:col-span-5">
          <HeroComment />
          <HeroTitle text={HERO.title} className="mt-4 text-h1 text-fg" />
          <p data-hero-sub className="mt-6 max-w-[34ch] text-body text-muted">
            {HERO.subtitle}
          </p>
          <div data-hero-cta className="mt-10">
            <Button href={SHOP_URL}>{HERO.cta}</Button>
          </div>
        </div>

        <div
          data-hero-product
          className="order-2 h-[52svh] md:h-[min(72svh,680px)] nostory:md:col-span-6 story:col-span-6 story:col-start-7"
        >
          <ProductSlot view="hero" priority interactive className="h-full w-full" />
        </div>
      </div>
      <ScrollIndicator />
    </StorySection>
  );
}
