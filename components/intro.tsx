"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";

/**
 * The entry animation. The logo draws itself on a black screen. Then the
 * camera moves through the ring of the logo and the site appears behind it.
 */
export function Intro({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const [leaving, setLeaving] = useState(false);

  // No page scroll while the intro plays.
  useEffect(() => {
    const root = document.documentElement;
    const before = root.style.overflow;
    root.style.overflow = "hidden";
    window.scrollTo(0, 0);
    return () => {
      root.style.overflow = before;
    };
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => setLeaving(true), reduce ? 900 : 3500);
    return () => window.clearTimeout(t);
  }, [reduce]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-[#050505]"
      initial={false}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={
        reduce
          ? { duration: 0.3 }
          : { duration: 0.9, delay: leaving ? 0.45 : 0, ease: [0.4, 0, 0.2, 1] }
      }
      onAnimationComplete={() => {
        if (leaving) onDone();
      }}
    >
      <motion.div
        className="w-[min(60vmin,340px)]"
        style={{ transformOrigin: "50% 43.33%" }}
        initial={false}
        animate={{ scale: leaving && !reduce ? 34 : 1 }}
        transition={{ duration: 1.35, ease: [0.7, 0, 0.84, 0] }}
      >
        <BrandLogo animated={!reduce} className="h-auto w-full" />
      </motion.div>

      {!leaving ? (
        <button
          type="button"
          onClick={() => setLeaving(true)}
          className="absolute bottom-8 right-8 text-[11px] uppercase tracking-[0.3em] text-white/50 transition-colors hover:text-white"
        >
          Skip intro
        </button>
      ) : null}
    </motion.div>
  );
}
