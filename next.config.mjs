/** @type {import('next').NextConfig} */

const nextConfig = {
  // `experimental.ppr` was merged into `cacheComponents` in newer Next releases.
  // Enable Partial Prerendering via `cacheComponents` instead.
  // Enable cacheComponents to turn on Partial Prerendering (PPR).
  // In newer Next releases this is a boolean flag.
  cacheComponents: true,
};

export default nextConfig;
