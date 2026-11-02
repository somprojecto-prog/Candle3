"use client";

import { cn } from "@/lib/cn";
import { PHOTOS, type PhotoAsset, type ProductView } from "@/lib/constants";
import ProductViewerLazy from "@/components/product/ProductViewerLazy";
import ProductPhoto from "@/components/ui/ProductPhoto";
import { useStoryMode } from "@/components/story/useStoryMode";

interface ProductSlotProps {
  view: ProductView;
  className?: string;
  interactive?: boolean;
  priority?: boolean;
}

function photoFor(view: ProductView): PhotoAsset | null {
  if (view === "intention") return PHOTOS.intention;
  if (view === "offer") return PHOTOS.specs;
  return null;
}

export default function ProductSlot({
  view,
  className,
  interactive,
  priority,
}: ProductSlotProps) {
  const mode = useStoryMode();

  if (mode === "on") {
    return <div aria-hidden data-cursor="product" className={className} />;
  }

  const photo = photoFor(view);
  if (photo) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <ProductPhoto asset={photo} priority={priority} />
      </div>
    );
  }

  return (
    <ProductViewerLazy
      view={view}
      className={className}
      interactive={interactive}
      priority={priority}
    />
  );
}
