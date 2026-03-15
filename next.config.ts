import type { NextConfig } from "next";

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  runtimeCaching: [],          // disable runtime caching
  buildExcludes: [/middleware-manifest\.json$/],
  exclude: [
    ({ request }: any) => {
      const url = new URL(request.url);
      return url.pathname.startsWith("/topic/");
    },
  ],
});

const nextConfig: NextConfig = {
  turbopack: {},
};

export default withPWA(nextConfig);