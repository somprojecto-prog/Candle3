import SmoothScroll from "@/components/providers/SmoothScroll";
import StoryProvider from "@/components/story/StoryProvider";
import HeroIntroController from "@/components/hero/HeroIntroController";
import CursorRing from "@/components/ui/CursorRing";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import ProductStatement from "@/components/sections/ProductStatement";
import Intention from "@/components/sections/Intention";
import Notes from "@/components/sections/Notes";
import Offer from "@/components/sections/Offer";
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
          <ProductStatement />
          <Intention />
          <Notes />
          <Offer />
        </StoryProvider>
        <ClosingCTA />
      </main>
      <Footer />
    </SmoothScroll>
  );
}