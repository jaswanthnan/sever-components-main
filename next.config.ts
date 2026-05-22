import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

import { withSentryConfig } from "@sentry/nextjs";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.29.239'],
  cacheComponents: true,
  turbopack: {
    root: projectRoot,
  },
  images: {
    // Serve modern formats: AVIF first (smaller), WebP fallback
    formats: ['image/avif', 'image/webp'],
    // Only allowed quality values (Next.js 16 requires explicit allowlist)
    qualities: [75, 90],
    // Cache optimized images for 24 hours
    minimumCacheTTL: 86400,
  },
};

const wrappedConfig = process.env.ANALYZE === 'true'
  ? withBundleAnalyzer({ enabled: true })(nextConfig)
  : nextConfig;

export default withSentryConfig(wrappedConfig, {
  // Suppresses source map uploading logs during profiling
  silent: true,
  org: "hiresync",
  project: "recruitment-crm",

  // Upload a larger set of source maps for prettier stack traces
  widenClientFileUpload: true,

  // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers
  tunnelRoute: "/monitoring",

  // Webpack-specific options for tree-shaking debug logging
  webpack: {
    treeshake: {
      removeDebugLogging: true,
    },
  },
});
