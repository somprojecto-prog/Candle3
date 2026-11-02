import SmoothScroll from "@/components/providers/SmoothScroll";
import StoryProvider from "@/components/story/StoryProvider";
import HeroIntroController from "@/components/hero/HeroIntroController";
import CursorRing from "@/components/ui/CursorRing";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import ProductReveal from "@/components/sections/ProductReveal";
import Statement from "@/components/sections/Statement";
import Intention from "@/components/sections/Intention";
import Notes from "@/components/sections/Notes";
import ProductSpecs from "@/components/sections/ProductSpecs";
import ClosingCTA from "@/components/sections/ClosingCTA";

export default function Page() {
  return (
    <SmoothScroll>
      <HeroIntroController />
      <CursorRing />
      <Header />
      <main>
        <StoryProvider>
          <Hero />
          <ProductReveal />
          <Statement />
          <Intention />
          <Notes />
          <ProductSpecs />
        </StoryProvider>
        <ClosingCTA />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
