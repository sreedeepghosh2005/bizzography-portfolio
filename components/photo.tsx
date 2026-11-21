"use client";

import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { cn } from "@/lib/utils";

/**
 * Shows a photo from /public. If the file is missing, it shows a placeholder
 * with the path, so you can see which file to add.
 */
// Empty in local dev. On GitHub Pages it is "/bizzography-portfolio".
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function Photo({
  src,
  alt,
  className,
  imgClassName,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
}) {
  const ref = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);

  // The image can fail before React attaches onError. Check once on mount.
  useEffect(() => {
    const img = ref.current;
    setFailed(!!img && img.complete && img.naturalWidth === 0);
  }, [src]);

  return (
    <div className={cn("relative overflow-hidden bg-[#0f0f0f]", className)}>
      {failed ? (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center"
          style={{
            background:
              "radial-gradient(120% 90% at 30% 10%, #2a2620 0%, #14130f 45%, #080808 100%)",
          }}
        >
<BrandLogo showName={false} className="w-[28%] max-w-16 opacity-40" />
          <span className="break-all font-mono text-[9px] uppercase leading-relaxed tracking-[0.12em] text-white/40">
            Add {src}
          </span>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={ref}
          src={src.startsWith("/") ? BASE_PATH + src : src}
          alt={alt}
          draggable={false}
          onError={() => setFailed(true)}
          className={cn("h-full w-full object-cover", imgClassName)}
        />
      )}
    </div>
  );
}
