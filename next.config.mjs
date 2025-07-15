/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@mah/ui'],
  experimental: {
    optimizePackageImports: ['@mah/ui'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  output: 'standalone',
};

export default nextConfig;
