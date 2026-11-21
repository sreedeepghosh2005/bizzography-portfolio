"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { Photo } from "@/components/photo";
import type { Detail } from "@/lib/site-content";

/**
 * The one detail view of the site. A photo card, an award, a package and a
 * contact all open this same panel: visual on the left, text on the right.
 */
export function DetailPanel({ detail, onClose }: { detail: Detail | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!detail) return;
    const opener = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    const before = root.style.overflow;
    root.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      root.style.overflow = before;
      opener?.focus?.();
    };
  }, [detail, onClose]);

  return (
    <AnimatePresence>
      {detail ? (
        <motion.div
          key="detail"
          className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md dark:bg-black/75"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={detail.title}
            className="relative grid max-h-[92svh] w-full max-w-4xl grid-cols-1 overflow-y-auto rounded-t-3xl bg-panel ring-1 ring-line sm:rounded-3xl md:grid-cols-2 md:overflow-hidden"
            initial={{ y: 40, scale: 0.97 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 24, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {/* visual */}
            <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[520px]">
              {detail.image ? (
                <Photo src={detail.image} alt={detail.title} className="absolute inset-0" />
              ) : (
                <div
                  className="absolute inset-0 grid place-items-center"
                  style={{
                    background:
                      "radial-gradient(110% 80% at 30% 15%, #2e2819 0%, #15130e 50%, #080808 100%)",
                  }}
                >
                  <BrandLogo showName={false} className="w-2/5 max-w-44 opacity-90" />
                  {detail.meta ? (
                    <span className="absolute bottom-6 left-7 font-display text-5xl italic text-[#c9a86a]/80">
                      {detail.meta.length <= 6 ? detail.meta : ""}
                    </span>
                  ) : null}
                </div>
              )}
            </div>

            {/* text */}
            <div className="flex flex-col p-7 sm:p-10">
              <p className="text-[11px] uppercase tracking-[0.4em] text-gold">{detail.kicker}</p>
              <h2 className="mt-4 font-display text-4xl font-medium leading-[1.02] text-ink sm:text-5xl">
                {detail.title}
              </h2>
              {detail.meta ? (
                <p className="mt-3 text-sm tracking-wide text-ink/50">{detail.meta}</p>
              ) : null}

              <div className="mt-6 space-y-3 text-[15px] font-light leading-relaxed text-ink/75">
                {detail.body.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>

              {detail.facts?.length ? (
                <dl className="mt-7 divide-y divide-line border-y border-line">
                  {detail.facts.map((fact) => (
                    <div key={fact.label} className="flex items-baseline justify-between gap-6 py-3">
                      <dt className="text-[11px] uppercase tracking-[0.25em] text-ink/45">
                        {fact.label}
                      </dt>
                      <dd className="text-right text-sm text-ink">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              {detail.cta ? (
                <a
                  href={detail.cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-night transition-colors hover:bg-gold md:mt-auto"
                >
                  {detail.cta.label}
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </a>
              ) : null}
            </div>

            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close details"
              className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-night/70 text-ink ring-1 ring-line backdrop-blur transition-colors hover:bg-ink hover:text-night"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
