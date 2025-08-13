/** @type {import('next').NextConfig} */
const baseConfig = {};

const withSentry = (() => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require("@sentry/nextjs");
    return typeof mod.withSentryConfig === "function" ? mod.withSentryConfig.bind(null) : (x) => x;
  } catch (e) {
    return (x) => x;
  }
})();

const nextConfig = withSentry(
  {
    ...baseConfig,
  },
  { silent: true },
);

export default nextConfig;
