import { PHOTOS, SECTION_IDS } from "@/lib/constants";
import StorySection from "@/components/story/StorySection";
import ProductSlot from "@/components/story/ProductSlot";
import ProductPhoto from "@/components/ui/ProductPhoto";

export default function ProductReveal() {
  const photo = PHOTOS.revealOpen;

  return (
    <StorySection id={SECTION_IDS.product} step="reveal" tone="base">
      <div
        role="group"
        aria-label="Deep Work Candle"
        className="h-[70svh] w-full"
      >
        <ProductSlot view="reveal" className="h-full w-full" />
      </div>

      {photo && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 hidden items-center justify-center bg-ink opacity-0 transition-opacity duration-[400ms] motion-reduce:transition-none story:flex [html[data-reveal-open='1']_&]:opacity-100"
        >
          <ProductPhoto asset={photo} className="max-h-full max-w-full object-contain" />
        </div>
      )}
    </StorySection>
  );
}