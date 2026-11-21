import type { NextConfig } from "next";

// The site is a static export, so any static host can serve it.
// On GitHub Pages the site lives under /bizzography-portfolio, so the build
// sets NEXT_PUBLIC_BASE_PATH to that. In local dev the variable is empty.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
