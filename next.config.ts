import type { NextConfig } from "next";
const path = require("path");

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ensure that all imports of 'yjs' resolve to the same instance
      config.resolve.alias["yjs"] = path.resolve(__dirname, "node_modules/yjs");
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: "",
      },
    ]
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: "/robots.txt",
  //       destination: "/api/robots",
  //     },
  //   ];
  // },

  // async headers() {
  //   return [
  //     {
  //       source: "/uploads/:path*",
  //       headers: [
  //         {
  //           key: "Cache-Control",
  //           value: "no-store, no-cache, must-revalidate, proxy-revalidate",
  //         },
  //         {
  //           key: "Pragma",
  //           value: "no-cache",
  //         },
  //         {
  //           key: "Expires",
  //           value: "0",
  //         },
  //       ],
  //     },
  //   ];
  // },
};

export default nextConfig;