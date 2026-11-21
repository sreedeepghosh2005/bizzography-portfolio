"use client";

import { motion } from "framer-motion";

const EASE = [0.65, 0, 0.35, 1] as const;

/**
 * The Bizzography mark, redrawn as SVG from the Instagram profile picture:
 * a thick white ring, then one white line that makes the inner ring, the
 * two diagonals and the "B", and the name. The points are traced from the
 * logo image.
 *
 * With `animated`, each part draws itself in order. Replace this with the
 * original logo file when it is available.
 */
export function BrandLogo({
  animated = false,
  showName = true,
  className,
}: {
  animated?: boolean;
  showName?: boolean;
  className?: string;
}) {
  // `full` is a little over 1 for the rings, so the end overlaps the start.
  const draw = (delay: number, duration: number, full = 1) =>
    animated
      ? {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: full, opacity: 1 },
          transition: {
            pathLength: { delay, duration, ease: EASE },
            opacity: { delay, duration: 0.01 },
          },
        }
      : {};

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label="Bizzography"
      fill="none"
      stroke="#fff"
      strokeLinecap="butt"
      strokeLinejoin="miter"
    >
      <circle cx="100" cy="100" r="99" fill="#000" stroke="rgba(255,255,255,.14)" strokeWidth="1" />

      {/* 1. the thick outer ring */}
      <motion.circle
        cx="100"
        cy="86.67"
        r="48.4"
        strokeWidth="10.4"
        transform="rotate(-90 100 86.67)"
        {...draw(0.15, 1, 1.03)}
      />

      {/*
        2. The white line. It is two strokes, and each one is continuous.
        Stroke A: the upper half of the inner ring, then the diagonal from the
        lower left, then the upper bowl of the B, then the stem.
        Stroke B: the lower half of the ring, then the diagonal from the upper
        right, then the lower bowl of the B, then the short lower stem.

        The two halves of the ring and the two diagonals are the same shape
        turned half a circle around the centre (100, 86.67). The two bowls
        have the same width, height and corner. A thin black gap runs between
        the two diagonals.
      */}
      <motion.path
        d="M131.2 66.41A37.2 37.2 0 0 0 66.43 102.63L104.76 81.07Q106.5 80.09 106.5 78.1V75A5.33 5.33 0 0 0 101.17 69.67H93.5V87.41"
        strokeWidth="3.6"
        {...draw(0.95, 1.25)}
      />
      <motion.path
        d="M68.8 106.93A37.2 37.2 0 0 0 133.57 70.71L108.24 84.95Q106.5 85.93 106.5 87.9V91A5.33 5.33 0 0 1 101.17 96.33H93.5V91.5"
        strokeWidth="3.6"
        {...draw(0.95, 1.25)}
      />

      {showName ? (
        <motion.text
          x="42.7"
          y="156.7"
          textLength="116"
          lengthAdjust="spacing"
          fill="#fff"
          stroke="none"
          fontSize="10.5"
          style={{ fontFamily: "var(--font-jost), system-ui, sans-serif", fontWeight: 500 }}
          {...(animated
            ? {
                initial: { opacity: 0, y: 6 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: 2.25, duration: 0.7, ease: EASE },
              }
            : {})}
        >
          BIZZOGRAPHY
        </motion.text>
      ) : null}
    </svg>
  );
}
