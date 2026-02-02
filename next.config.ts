import type { NextConfig } from "next";

// Domaine perso (0xbbuddha.fr) = pas de basePath. Sinon GitHub Pages projet = /nom-du-repo
const basePath =
  process.env.BASE_PATH !== undefined
    ? process.env.BASE_PATH
    : (process.env.GITHUB_REPOSITORY?.split("/")[1]
        ? `/${process.env.GITHUB_REPOSITORY.split("/")[1]}`
        : "");

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath || undefined,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  images: { unoptimized: true },
};

export default nextConfig;
