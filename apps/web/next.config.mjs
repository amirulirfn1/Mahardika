/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@mahardika/ui'],
  experimental: {
    optimizePackageImports: ['@mahardika/ui'],
  },
};

export default nextConfig; 