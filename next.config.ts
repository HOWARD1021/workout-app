import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  images: {
    // Disable image optimization for Cloudflare Workers compatibility
    unoptimized: true,
  },
};

export default nextConfig;
