import { notFound } from "next/navigation";
import ContrastProbe from "@/components/product/ContrastProbe";
import LookTuner from "@/components/product/LookTuner";
import ProductViewerLazy from "@/components/product/ProductViewerLazy";
import type { ProductView } from "@/lib/constants";

type SearchParams = Record<string, string | string[] | undefined>;

const VIEW_LIST: readonly ProductView[] = ["hero", "reveal", "intention", "offer"];

const first = (v: string | string[] | undefined): string | undefined => (Array.isArray(v) ? v[0] : v);

const num = (v: string | string[] | undefined): number | undefined => {
  const s = first(v);
  if (s === undefined || s.trim() === "") return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
};

export default async function DevProductPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  if (process.env.NODE_ENV === "production") notFound();

  const sp = await searchParams;
  const debugCamera: Partial<{ azim: number; elev: number; dist: number; targetY: number }> = {};
  const az = num(sp.az);
  const el = num(sp.el);
  const d = num(sp.d);
  const ty = num(sp.ty);
  if (az !== undefined) debugCamera.azim = az;
  if (el !== undefined) debugCamera.elev = el;
  if (d !== undefined) debugCamera.dist = d;
  if (ty !== undefined) debugCamera.targetY = ty;

  const probe = first(sp.probe) === "1";
  const tune = first(sp.tune) === "1";
  const pvRaw = first(sp.pv);
  const pv: ProductView = VIEW_LIST.find((v) => v === pvRaw) ?? "hero";

  return (
    <main className="min-h-screen bg-ink text-fg">
      <p className="px-6 py-4 font-mono text-label uppercase text-muted">
        Dev · /dev/product?probe=1&amp;tune=1&amp;pv=hero|reveal|intention|offer&amp;az=30&amp;el=14&amp;d=6.4&amp;ty=0
      </p>
      <div className="grid grid-cols-1 gap-px bg-line md:grid-cols-2 xl:grid-cols-4">
        {VIEW_LIST.map((view) => (
          <div key={view} data-probe-view={view} className="relative h-[600px] bg-[#050505]">
            <span className="absolute left-3 top-3 z-10 font-mono text-label uppercase text-gold">{view}</span>
            <ProductViewerLazy view={view} priority debugCamera={debugCamera} />
          </div>
        ))}
      </div>
      {probe && <ContrastProbe selector={`[data-probe-view="${pv}"] canvas`} mode="static" />}
      {tune && <LookTuner />}
    </main>
  );
}