import type { ArtRecipe } from "@/components/ui/glass-folder-cards";

/**
 * All text and image paths for the site live in this file.
 *
 * Lines marked DRAFT were not on the Instagram profile. Replace them with the
 * real details before the site goes live.
 */

export const INSTAGRAM_URL = "https://www.instagram.com/bizzography/";

export type Detail = {
  /** Small line above the title. */
  kicker: string;
  title: string;
  /** Short line under the title: a year, a price, a handle. */
  meta?: string;
  body: string[];
  facts?: { label: string; value: string }[];
  /** A photo for the left side. Without one the panel shows the monogram. */
  image?: string;
  cta?: { label: string; href: string };
};

export type PhotoItem = {
  /** Put the file in /public/photos with this name. */
  src: string;
  title: string;
  category: string;
  detail: Detail;
};

const photo = (n: number, title: string, category: string, text: string): PhotoItem => {
  const src = `/photos/${String(n).padStart(2, "0")}.jpg`;
  return {
    src,
    title,
    category,
    detail: {
      kicker: category,
      title,
      meta: `Frame ${String(n).padStart(2, "0")}`,
      body: [text],
      image: src,
      cta: { label: "Enquire about a shoot like this", href: INSTAGRAM_URL },
    },
  };
};

// The ten photos are the newest posts on the Instagram grid, saved at grid
// size (about 512 x 640). Replace the files with the full-size originals.
// DRAFT: I wrote the titles and the text from what each photo shows.
export const PHOTOS: PhotoItem[] = [
  photo(1, "In the mist", "Pre-wedding", "A couple sits on a green slope in a misty forest."),
  photo(2, "The bride in red", "Bridal portrait", "A bridal portrait in red, against a deep red background."),
  photo(3, "Haldi", "Wedding", "A close frame from a haldi ceremony, with hands in mehndi."),
  photo(4, "In the meadow", "Couple portrait", "A couple stands in a meadow under a blue sky."),
  photo(5, "Behind the veil", "Bridal portrait", "A bride smiles under a red veil."),
  photo(6, "Morning light", "Pre-wedding", "A couple walks through a forest in rays of morning light."),
  photo(7, "The tea garden", "Pre-wedding", "A couple stands on a tea garden slope."),
  photo(8, "Hand in hand", "Wedding", "A couple walks hand in hand. Black and white."),
  photo(9, "Among the tea", "Pre-wedding", "Three frames of a couple in a tea garden."),
  photo(10, "At home", "Couple portrait", "Three frames of a couple indoors."),
];

export const ABOUT = {
  kicker: "The man behind the lens",
  // The name is on the Instagram post of the portrait and on the photo watermarks.
  name: "Bijendra Pradhan",
  portrait: "/photos/portrait.jpg",
  // DRAFT: this text only restates the Instagram bio. Replace with a real biography.
  paragraphs: [
    "Bizzography is a photography service with more than twelve years of capturing memories.",
    "The work covers weddings, pre-wedding stories, portraits and fashion. It is photography only.",
  ],
  stats: [
    { value: "12+", label: "Years behind the camera" },
    { value: "#2", label: "PROwed, India, 2021" },
    { value: "2016", label: "DPS Photographer of the Year" },
  ],
  personalHandle: "@storiesbybijendra",
  personalUrl: "https://www.instagram.com/storiesbybijendra/",
};

// Folder artwork. Black, warm white and gold only, to match the logo.
export const ART_INK: ArtRecipe = {
  style: "marble",
  colors: ["#050505", "#1c1b19", "#57524a", "#0d0d0d", "#8a7448", "#d9c08a", "#f4ecd8"],
  scale: 0.7,
  warp: 3.3,
  angle: -0.5,
  gloss: 0.5,
  veins: 0.5,
};

export const ART_SMOKE: ArtRecipe = {
  style: "streak",
  colors: ["#0a0a0a", "#2a2927", "#77726a", "#151515", "#b9b2a4", "#efeae0"],
  scale: 0.7,
  warp: 1.5,
  angle: 0.4,
  gloss: 0.2,
  veins: 0,
};

export const ART_BRASS: ArtRecipe = {
  style: "marble",
  colors: ["#080706", "#2b2418", "#6b5a36", "#12100c", "#c9a86a", "#ecd9ab", "#fbf5e3"],
  scale: 0.75,
  warp: 3.6,
  angle: 2.0,
  gloss: 0.55,
  veins: 0.45,
};

export type FolderItem = {
  name: string;
  meta?: string;
  art?: ArtRecipe;
  detail: Detail;
};

export type FolderGroup = {
  id: string;
  label: string;
  art: ArtRecipe;
  seed: number;
  items: FolderItem[];
};

const enquire = { label: "Enquire on Instagram", href: INSTAGRAM_URL };

export const FOLDERS: FolderGroup[] = [
  {
    id: "awards",
    label: "Awards",
    art: ART_BRASS,
    seed: 5,
    items: [
      {
        name: "DPS Photographer of the Year",
        meta: "2016",
        detail: {
          kicker: "Award",
          title: "DPS Photographer of the Year",
          meta: "2016",
          // DRAFT: add the full name of the awarding body and the winning photo.
          body: ["Named DPS Photographer of the Year in 2016."],
          facts: [
            { label: "Year", value: "2016" },
            { label: "Awarded by", value: "DPS" },
          ],
        },
      },
      {
        name: "DPS Exhibition",
        meta: "2018",
        art: ART_SMOKE,
        detail: {
          kicker: "Exhibition",
          title: "DPS Exhibition",
          meta: "2018",
          // DRAFT: add the venue and the photos shown.
          body: ["Work shown at the DPS Exhibition in 2018."],
          facts: [
            { label: "Year", value: "2018" },
            { label: "Type", value: "Exhibition" },
          ],
        },
      },
      {
        name: "Photographer of the Year",
        meta: "2019",
        detail: {
          kicker: "Award",
          title: "Photographer of the Year",
          meta: "2019",
          // DRAFT: the profile only says "POTY 2019". Add who gave the award.
          body: ["Photographer of the Year, 2019."],
          facts: [{ label: "Year", value: "2019" }],
        },
      },
      {
        name: "PROwed Top #2, India",
        meta: "2021",
        art: ART_BRASS,
        detail: {
          kicker: "Award",
          title: "PROwed — Top #2 in India",
          meta: "2021",
          body: ["Ranked number two in India in PROwed's Photographer of the Year, 2021."],
          facts: [
            { label: "Year", value: "2021" },
            { label: "Awarded by", value: "PROwed" },
            { label: "Rank", value: "#2 in India" },
          ],
        },
      },
    ],
  },
  {
    id: "packages",
    label: "Packages",
    art: ART_INK,
    seed: 11,
    // DRAFT: package names come from the kinds of work on the profile.
    // Add the real inclusions and prices.
    items: [
      {
        name: "Workshops",
        meta: "For photographers",
        detail: {
          kicker: "Package",
          title: "Workshops",
          meta: "For photographers",
          body: ["Photography workshops. Ask for the next date and the fee."],
          facts: [{ label: "Price", value: "On request" }],
          cta: enquire,
        },
      },
      {
        name: "Fashion & Portrait",
        meta: "Studio or location",
        art: ART_SMOKE,
        detail: {
          kicker: "Package",
          title: "Fashion & Portrait",
          meta: "Studio or location",
          body: ["Fashion shoots and portraits. Ask for the current inclusions and price."],
          facts: [{ label: "Price", value: "On request" }],
          cta: enquire,
        },
      },
      {
        name: "Pre-wedding",
        meta: "Couple shoot",
        detail: {
          kicker: "Package",
          title: "Pre-wedding",
          meta: "Couple shoot",
          body: ["A pre-wedding shoot for the couple. Ask for the current inclusions and price."],
          facts: [{ label: "Price", value: "On request" }],
          cta: enquire,
        },
      },
      {
        name: "Wedding",
        meta: "Photography only",
        art: ART_INK,
        detail: {
          kicker: "Package",
          title: "Wedding",
          meta: "Photography only",
          body: [
            "Wedding photography. This is a photography-only service.",
            "Ask for the current inclusions and price.",
          ],
          facts: [{ label: "Price", value: "On request" }],
          cta: enquire,
        },
      },
    ],
  },
  {
    id: "contact",
    label: "Contact",
    art: ART_SMOKE,
    seed: 3,
    // DRAFT: no phone number or email is on the profile. Add them here.
    items: [
      {
        name: "The Art Lane",
        meta: "@theartlaneofficial",
        detail: {
          kicker: "Contact",
          title: "The Art Lane",
          meta: "@theartlaneofficial",
          body: ["The Art Lane is linked from the Bizzography profile."],
          cta: {
            label: "Open @theartlaneofficial",
            href: "https://www.instagram.com/theartlaneofficial/",
          },
        },
      },
      {
        name: "Personal",
        meta: "@storiesbybijendra",
        art: ART_INK,
        detail: {
          kicker: "Contact",
          title: "Personal account",
          meta: "@storiesbybijendra",
          body: ["The photographer's personal Instagram account."],
          cta: {
            label: "Open @storiesbybijendra",
            href: "https://www.instagram.com/storiesbybijendra/",
          },
        },
      },
      {
        name: "Bookings",
        meta: "@bizzography",
        detail: {
          kicker: "Contact",
          title: "Bookings",
          meta: "@bizzography",
          body: ["Send a message on Instagram with your date, city and the kind of shoot."],
          facts: [{ label: "Instagram", value: "@bizzography" }],
          cta: { label: "Message @bizzography", href: INSTAGRAM_URL },
        },
      },
    ],
  },
];
