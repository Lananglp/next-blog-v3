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

  async headers() {
    return [
      {
        source: "/uploads/:path*", // Terapkan aturan ini untuk semua file di /uploads/
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, must-revalidate", // Hindari caching
          },
        ],
      },
    ];
  },
};

export default nextConfig;