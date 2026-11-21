"use client";

import {
    motion,
    useTransform,
    useReducedMotion,
    useMotionValue,
    useScroll,
    useSpring,
    MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Photo } from "@/components/photo";

/**
 * Perspective Tunnel Hero.
 *
 * Changes from the original 21st.dev component:
 * - The images come from the `items` prop.
 * - The tunnel follows the page scroll. The section is tall and the stage is
 *   sticky, so the next section appears when the tunnel ends. The original
 *   took over the mouse wheel and never let the page scroll.
 * - Each card is a button and calls `onSelect`.
 * - The colours use the site tokens (night, ink, gold).
 */

export interface TunnelItem {
    src: string;
    title: string;
    category?: string;
}

interface TunnelCardData {
    item: TunnelItem;
    angleCos: number;
    angleSin: number;
    radiusFactorX: number;
    radiusFactorY: number;
    rotationZ: number;
    index: number;
}

function layoutCards(items: TunnelItem[]): TunnelCardData[] {
    return items.map((item, i) => {
        const goldenAngle = i * 137.5 * (Math.PI / 180);
        const radiusFactorX = 0.28 + (i % 3) * 0.08;
        const radiusFactorY = 0.26 + (i % 2) * 0.09;

        return {
            item,
            angleCos: Math.cos(goldenAngle),
            angleSin: Math.sin(goldenAngle),
            radiusFactorX,
            radiusFactorY,
            rotationZ: (i % 2 === 0 ? 1 : -1) * (3 + (i % 5) * 2),
            index: i,
        };
    });
}

const SPRING_CONFIG = { stiffness: 60, damping: 25, mass: 0.5 };

interface StageDimensions {
    width: number;
    height: number;
    isMobile: boolean;
}

function useCameraParallax(enabled: boolean) {
    const rawX = useMotionValue(0);
    const rawY = useMotionValue(0);
    const x = useSpring(rawX, SPRING_CONFIG);
    const y = useSpring(rawY, SPRING_CONFIG);

    useEffect(() => {
        if (!enabled) return;
        const onMove = (e: PointerEvent) => {
            rawX.set((e.clientX / window.innerWidth - 0.5) * 2);
            rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => window.removeEventListener("pointermove", onMove);
    }, [enabled, rawX, rawY]);

    return { x, y };
}

interface TunnelCardProps {
    card: TunnelCardData;
    progress: MotionValue<number>;
    pointer: { x: MotionValue<number>; y: MotionValue<number> };
    total: number;
    stage: StageDimensions;
    onSelect?: (index: number) => void;
}

function TunnelCard({ card, progress, pointer, total, stage, onSelect }: TunnelCardProps) {
    const staggerSpan = 0.55;
    const start = (card.index / total) * (1 - staggerSpan);
    const end = start + staggerSpan;

    const localProgress = useTransform(progress, [start, end], [0, 1]);

    // On a phone the far point is closer, so the first frames are not tiny.
    const farZ = stage.isMobile ? -700 : -1700;
    const nearZ = stage.isMobile ? 350 : 500;
    const z = useTransform(localProgress, [0, 1], [farZ, nearZ]);

    const opacity = useTransform(localProgress, [0, 0.18, 0.82, 0.98], [0, 1, 1, 0]);
    // A card you cannot see must not take clicks or keyboard focus.
    const visibility = useTransform(opacity, (o) => (o > 0.05 ? "visible" : "hidden"));

    const cardWidth = stage.isMobile
        ? Math.max(170, Math.min(240, stage.width * 0.52))
        : Math.max(180, Math.min(270, stage.width * 0.18));

    const baseX = card.angleCos * (stage.width * card.radiusFactorX);
    // A phone screen is tall. The frames use more of the height there.
    const baseY = card.angleSin * (stage.height * card.radiusFactorY * (stage.isMobile ? 1.2 : 1));
    const panStrength = stage.isMobile ? 20 : 45;

    const transform = useTransform(
        [z, pointer.x, pointer.y],
        ([currZ, px, py]: number[]) => {
            const offsetX = baseX - px * panStrength;
            const offsetY = baseY - py * panStrength;
            return `translate3d(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px), ${currZ}px) rotateZ(${card.rotationZ}deg)`;
        }
    );

    return (
        <motion.button
            type="button"
            onClick={() => onSelect?.(card.index)}
            aria-label={`${card.item.title}. Open details`}
            style={{
                width: cardWidth,
                transform,
                opacity,
                visibility,
                zIndex: card.index + 1,
            }}
            className="group pointer-events-auto absolute left-1/2 top-1/2 aspect-[4/5] cursor-pointer select-none rounded-2xl text-left will-change-transform"
        >
            <div className="relative h-full w-full overflow-hidden rounded-2xl bg-neutral-900 shadow-2xl shadow-black/35 ring-1 ring-line dark:shadow-black/90 transition-all duration-500 group-hover:ring-gold/70 group-hover:shadow-gold/20 group-focus-visible:ring-gold">
                <Photo
                    src={card.item.src}
                    alt={card.item.title}
                    className="h-full w-full"
                    imgClassName="transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/10 to-transparent p-4 sm:p-5">
                    <span className="flex flex-col gap-1">
                        {card.item.category ? (
                            <span className="text-[10px] uppercase tracking-[0.3em] text-[#e2c58a] md:text-[9px]">
                                {card.item.category}
                            </span>
                        ) : null}
                        <span className="font-display text-xl italic leading-tight text-white">
                            {card.item.title}
                        </span>
                    </span>
                </div>
            </div>
        </motion.button>
    );
}

export interface PerspectiveTunnelHeroProps {
    items: TunnelItem[];
    onSelect?: (index: number) => void;
    kicker?: string;
    title: ReactNode;
    subtitle?: string;
    /** Scroll length of the tunnel, in viewport heights. */
    length?: number;
    id?: string;
}

export default function PerspectiveTunnelHero({
    items,
    onSelect,
    kicker,
    title,
    subtitle,
    length = 4.5,
    id,
}: PerspectiveTunnelHeroProps) {
    const containerRef = useRef<HTMLElement>(null);
    const reduce = useReducedMotion();
    const cards = layoutCards(items);

    const [stage, setStage] = useState<StageDimensions>({
        width: 1440,
        height: 900,
        isMobile: false,
    });

    useEffect(() => {
        const updateDimensions = () => {
            setStage({
                width: window.innerWidth,
                height: window.innerHeight,
                isMobile: window.innerWidth < 768,
            });
        };

        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    // The page scroll moves the camera through the tunnel.
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 80,
        damping: 30,
        restDelta: 0.0001,
    });

    // The cards start a little way in, so some frames are on screen before the first scroll.
    const cardProgress = useTransform(smoothProgress, [0, 1], [0.14, 1]);

    const pointer = useCameraParallax(!reduce);

    const titleScale = useTransform(smoothProgress, [0, 0.5, 1], [0.92, 1, 1.3]);
    const titleOpacity = useTransform(smoothProgress, [0, 0.82, 0.97], [1, 1, 0]);
    const promptOpacity = useTransform(smoothProgress, [0, 0.08], [1, 0]);

    return (
        <section
            ref={containerRef}
            id={id}
            className="relative"
            style={{ height: `${length * 100}svh` }}
        >
            <div
                className="sticky top-0 flex h-[100svh] w-full select-none items-center justify-center overflow-hidden bg-night text-ink"
                style={{
                    perspective: stage.isMobile ? "900px" : "1200px",
                    transformStyle: "preserve-3d",
                }}
            >
                {/* Background grid and glow */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--dot)_1px,transparent_1px)] opacity-60 [background-size:28px_28px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_60%,transparent_100%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,var(--glow)_0%,transparent_70%)]" />

                {/* Depth ring guides */}
                <div className="pointer-events-none absolute h-[72vmin] w-[72vmin] rounded-full md:h-[48vmin] md:w-[48vmin] border border-gold/15" />
                <div className="pointer-events-none absolute h-[118vmin] w-[118vmin] rounded-full md:h-[76vmin] md:w-[76vmin] border border-dashed border-line" />

                {/* Central title */}
                <motion.div
                    style={{ scale: titleScale, opacity: titleOpacity }}
                    className="pointer-events-none z-0 flex max-w-2xl flex-col items-center px-6 text-center"
                >
                    {kicker ? (
                        <p className="mb-5 text-balance text-[13px] uppercase leading-relaxed tracking-[0.3em] text-gold md:text-[11px] md:tracking-[0.4em]">{kicker}</p>
                    ) : null}
                    <h1 className="font-display text-[clamp(3.75rem,20vw,5rem)] font-medium leading-[0.92] tracking-tight text-ink md:text-8xl">
                        {title}
                    </h1>
                    {subtitle ? (
                        <p className="mt-6 max-w-[30ch] text-lg font-light text-ink/60 md:max-w-[36ch] md:text-base">
                            {subtitle}
                        </p>
                    ) : null}
                </motion.div>

                {/* Scroll prompt */}
                <motion.div
                    style={{ opacity: promptOpacity }}
                    className="pointer-events-none absolute bottom-8 z-20 flex flex-col items-center gap-2 text-[13px] uppercase tracking-[0.3em] text-ink/50 md:text-[11px]"
                >
                    <span>Scroll to explore</span>
                    <div className="h-6 w-px bg-gradient-to-b from-gold to-transparent" />
                </motion.div>

                {/* 3D Z-space plane */}
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{ transformStyle: "preserve-3d" }}
                >
                    {cards.map((card) => (
                        <TunnelCard
                            key={card.index}
                            card={card}
                            progress={cardProgress}
                            pointer={pointer}
                            total={cards.length}
                            stage={stage}
                            onSelect={onSelect}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
