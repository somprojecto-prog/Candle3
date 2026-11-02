import Image from "next/image";
import { cn } from "@/lib/cn";
import type { PhotoAsset } from "@/lib/constants";

interface ProductPhotoProps {
  asset: PhotoAsset;
  className?: string;
  priority?: boolean;
}

export default function ProductPhoto({ asset, className, priority = false }: ProductPhotoProps) {
  return (
    <Image
      src={asset.src}
      width={asset.width}
      height={asset.height}
      alt={asset.alt}
      priority={priority}
      placeholder="empty"
      sizes="(min-width: 1024px) 50vw, 100vw"
      className={cn("h-full w-full object-cover", className)}
    />
  );
}
