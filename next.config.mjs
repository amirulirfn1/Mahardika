/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@mahardika/ui'],
  experimental: {
    optimizePackageImports: ['@mahardika/ui'],
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
