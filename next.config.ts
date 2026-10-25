import type { NextConfig } from "next";

// GitHub Pages serves static files only, so the whole site is exported at build
// time. trailingSlash makes every route a folder/index.html, which Pages resolves
// without rewrites.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
