"use client";

import dynamic from "next/dynamic";
import { STORY_FOCUS } from "@/lib/story";
import { useStoryMode } from "@/components/story/useStoryMode";

const StoryCanvas = dynamic(
  () => import("@/components/story-canvas/StoryCanvas"),
  { ssr: false },
);

export default function StoryStage() {
  const mode = useStoryMode();

  return (
    <div
      aria-hidden
      data-hero-product
      style={{
        transformOrigin: `${STORY_FOCUS[0][0] * 100}% ${STORY_FOCUS[0][1] * 100}%`,
      }}
      className="pointer-events-none sticky top-0 z-0 -mb-[100svh] hidden h-svh story:block"
    >
      {mode === "on" && <StoryCanvas />}
    </div>
  );
}
