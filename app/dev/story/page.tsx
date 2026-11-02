import { notFound } from "next/navigation";
import StoryDev from "@/components/story-canvas/StoryDev";

type SearchParams = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined): string | undefined => (Array.isArray(v) ? v[0] : v);

const parseNum = (v: string | string[] | undefined): number => {
  const s = first(v);
  if (s === undefined || s.trim() === "") return 0;
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
};

export default async function DevStoryPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  if (process.env.NODE_ENV === "production") notFound();

  const sp = await searchParams;
  return (
    <StoryDev
      initialPhase={parseNum(sp.phase)}
      initialReveal={parseNum(sp.reveal)}
      probe={first(sp.probe) === "1"}
      tune={first(sp.tune) === "1"}
    />
  );
}