"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Moon, Sun } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { DetailPanel } from "@/components/detail-panel";
import { Intro } from "@/components/intro";
import { Photo } from "@/components/photo";
import GlassFolder from "@/components/ui/glass-folder-cards";
import HalftoneWordmarkFooter, { type FooterColumn } from "@/components/ui/halftone-wordmark-footer";
import PerspectiveTunnelHero from "@/components/ui/perspective-tunnel-hero";
import { ABOUT, FOLDERS, INSTAGRAM_URL, PHOTOS, type Detail } from "@/lib/site-content";

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.8, ease: [0.2, 0.8, 0.2, 1] as const },
};

/** The heading used by every section: gold kicker, then a serif title. */
function SectionHeading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <motion.div {...reveal}>
      <p className="text-[11px] uppercase tracking-[0.4em] text-gold">{kicker}</p>
      <h2 className="mt-4 font-display text-5xl font-medium leading-[0.98] text-ink sm:text-6xl">
        {title}
      </h2>
    </motion.div>
  );
}

// The footer draws on a canvas, so it needs plain hex colours. These are the
// same values as --night, --ink and --gold in app/globals.css.
const FOOTER_COLORS = {
  dark: { background: "#070707", ink: "#f4f1ea", warm: "#c9a86a" },
  light: { background: "#f5f1e8", ink: "#16140f", warm: "#8f6f2e" },
};

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Site",
    links: [
      { label: "Work", href: "#work" },
      { label: "About", href: "#about" },
      { label: "Book", href: "#folders" },
    ],
  },
  {
    title: "Shoots",
    links: [
      { label: "Wedding", href: "#folders" },
      { label: "Pre-wedding", href: "#folders" },
      { label: "Fashion & Portrait", href: "#folders" },
    ],
  },
  {
    title: "Instagram",
    links: [
      { label: "@bizzography", href: INSTAGRAM_URL },
      { label: "@storiesbybijendra", href: ABOUT.personalUrl },
    ],
  },
];

/**
 * The font name for the footer canvas. A canvas cannot read the CSS variable
 * --font-jost, so this reads the real font name from the page after it loads.
 */
function useBodyFont() {
  const [font, setFont] = useState("system-ui, sans-serif");
  useEffect(() => {
    setFont(getComputedStyle(document.body).fontFamily || "system-ui, sans-serif");
  }, []);
  return font;
}

/**
 * The width of one folder. The three folders always sit on one line, so the
 * width is one third of the row. The numbers match the padding and the gap
 * classes on the folder section.
 */
function useFolderWidth() {
  const [width, setWidth] = useState(340);
  useEffect(() => {
    const update = () => {
      const page = document.documentElement.clientWidth;
      const padding = page < 640 ? 32 : 48;
      const gap = page < 640 ? 8 : page < 1024 ? 24 : 40;
      const row = Math.min(page, 1152) - padding;
      setWidth(Math.max(84, Math.min(340, Math.floor((row - gap * 2) / 3))));
    };
    update();
    // The page width also changes when a scrollbar appears, with no resize event.
    const observer = new ResizeObserver(update);
    observer.observe(document.documentElement);
    return () => observer.disconnect();
  }, []);
  return width;
}

/**
 * Light or dark mode. The choice is the "dark" class on <html>, and it is
 * saved in localStorage under "theme". Dark is the default.
 */
function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // The script in app/layout.tsx has already set the class. Read it once.
  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", next === "dark");
      try {
        localStorage.setItem("theme", next);
      } catch {
        // Storage can be blocked. The toggle still works for this visit.
      }
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}

export default function Site() {
  const [introDone, setIntroDone] = useState(false);
  const [detail, setDetail] = useState<Detail | null>(null);
  const closeDetail = useCallback(() => setDetail(null), []);
  const folderWidth = useFolderWidth();
  // A small folder has text too small to read. Then the names go under it.
  const compact = folderWidth < 200;
  const [openedId, setOpenedId] = useState<string | null>(null);
  const opened = FOLDERS.find((group) => group.id === openedId) ?? null;
  const { theme, toggleTheme } = useTheme();
  const footerFont = useBodyFont();

  return (
    <div className="bg-night text-ink">
      {!introDone ? <Intro onDone={() => setIntroDone(true)} /> : null}

      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-4 sm:px-8">
        <a href="#work" aria-label="Bizzography, back to top" className="block size-11">
          <BrandLogo showName={false} className="size-full" />
        </a>
        <nav className="flex items-center gap-5 rounded-full bg-night/60 py-1.5 pl-5 pr-1.5 text-[11px] uppercase tracking-[0.25em] text-ink/70 ring-1 ring-line backdrop-blur-md sm:gap-7">
          <a href="#work" className="transition-colors hover:text-gold">Work</a>
          <a href="#about" className="transition-colors hover:text-gold">About</a>
          <a href="#folders" className="transition-colors hover:text-gold">Book</a>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={theme === "light"}
            className="grid size-8 place-items-center rounded-full bg-ink/10 text-ink transition-colors hover:bg-gold hover:text-night"
          >
            {theme === "dark" ? (
              <Sun className="size-4" aria-hidden="true" />
            ) : (
              <Moon className="size-4" aria-hidden="true" />
            )}
          </button>
        </nav>
      </header>

      <main>
        <PerspectiveTunnelHero
          id="work"
          items={PHOTOS}
          onSelect={(i) => setDetail(PHOTOS[i].detail)}
          kicker="Bizzography · Photography · 12+ years"
          title={
            <>
              Capturing
              <br />
              <em className="text-gold">memories.</em>
            </>
          }
          subtitle="Scroll to move through the best frames. Select a frame to see its details."
        />

        {/* The man behind the lens */}
        <section id="about" className="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-28 sm:py-36">
          <div className="grid items-center gap-12 md:grid-cols-[5fr_6fr] md:gap-20">
            <motion.div {...reveal} className="relative">
              <Photo
                src={ABOUT.portrait}
                alt={`${ABOUT.name}, the photographer behind Bizzography`}
                className="aspect-[4/5] w-full rounded-2xl ring-1 ring-line"
              />
              <div className="pointer-events-none absolute -bottom-5 -right-5 hidden size-28 rounded-full border border-gold/40 sm:block" />
            </motion.div>

            <div>
              <SectionHeading kicker={ABOUT.kicker} title={ABOUT.name} />
              <motion.div
                {...reveal}
                className="mt-8 max-w-[52ch] space-y-4 text-base font-light leading-relaxed text-ink/75 sm:text-lg"
              >
                {ABOUT.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </motion.div>

              <motion.dl
                {...reveal}
                className="mt-10 grid grid-cols-3 gap-4 border-t border-line pt-8"
              >
                {ABOUT.stats.map((s) => (
                  <div key={s.label}>
                    <dd className="font-display text-4xl italic text-gold sm:text-5xl">{s.value}</dd>
                    <dt className="mt-2 text-[10px] uppercase leading-relaxed tracking-[0.22em] text-ink/50 sm:text-[11px]">
                      {s.label}
                    </dt>
                  </div>
                ))}
              </motion.dl>

              <motion.a
                {...reveal}
                href={ABOUT.personalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-ink/70 transition-colors hover:text-gold"
              >
                {ABOUT.personalHandle}
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </motion.a>
            </div>
          </div>
        </section>

        {/* Awards, packages, contact */}
        <section id="folders" className="relative scroll-mt-24 overflow-hidden px-4 pb-32 pt-10 sm:px-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage: "radial-gradient(var(--ink) 1.1px, transparent 1.4px)",
              backgroundSize: "22px 22px",
              maskImage: "radial-gradient(ellipse 80% 70% at 50% 55%, #000 40%, transparent 100%)",
            }}
          />
          <div className="relative mx-auto max-w-6xl">
            <div className="text-center">
              <SectionHeading kicker="Awards · Packages · Contact" title="Open a folder" />
            </div>

            <div className="mt-16 grid grid-cols-3 items-end justify-items-center gap-x-2 sm:gap-x-6 lg:gap-x-10">
              {FOLDERS.map((group, i) => (
                <div key={group.id} className="flex flex-col items-center">
                  <GlassFolder
                    label={group.label}
                    tone={theme}
                    art={group.art}
                    seed={group.seed}
                    action="none"
                    width={folderWidth}
                    appearDelay={i * 140}
                    files={group.items.map(({ name, meta, art }) => ({ name, meta, art }))}
                    onOpenChange={(open) => {
                      if (open) setOpenedId(group.id);
                    }}
                    onFileSelect={(_, index) => setDetail(group.items[index].detail)}
                  />
                  {compact ? (
                    <span
                      aria-hidden="true"
                      className={`mt-3 text-[10px] uppercase tracking-[0.22em] transition-colors ${
                        openedId === group.id ? "text-gold" : "text-ink/60"
                      }`}
                    >
                      {group.label}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>

            {/* On a phone the file names in the folder are too small, so they are listed here. */}
            {compact && opened ? (
              <motion.ul
                key={opened.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                aria-label={`${opened.label} files`}
                className="mx-auto mt-8 max-w-md divide-y divide-line overflow-hidden rounded-2xl bg-panel ring-1 ring-line"
              >
                {opened.items.map((item) => (
                  <li key={item.name}>
                    <button
                      type="button"
                      onClick={() => setDetail(item.detail)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-ink/5"
                    >
                      <span className="font-display text-xl leading-tight text-ink">{item.name}</span>
                      <span className="flex shrink-0 items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-ink/50">
                        {item.meta}
                        <ArrowUpRight className="size-3.5 text-gold" aria-hidden="true" />
                      </span>
                    </button>
                  </li>
                ))}
              </motion.ul>
            ) : null}

            <p className="mt-10 text-center text-[10px] uppercase leading-relaxed tracking-[0.3em] text-ink/40 sm:mt-14 sm:text-[11px]">
              {compact
                ? "Tap a folder · Then tap a file in the list"
                : "Select a folder to open it · Select a file to see its details"}
            </p>
          </div>
        </section>
      </main>

      <HalftoneWordmarkFooter
        wordmark="BIZZOGRAPHY"
        label="Bizzography"
        meta="Photography · 12+ years"
        columns={FOOTER_COLUMNS}
        palette={FOOTER_COLORS[theme]}
        fontFamily={footerFont}
        monoFamily={footerFont}
        dotGap={compact ? 3 : 6}
        height={compact ? "330px" : "450px"}
      />

      <DetailPanel detail={detail} onClose={closeDetail} />
    </div>
  );
}
