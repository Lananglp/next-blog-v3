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
};

module.exports = {
  async headers() {
    return [
      {
        source: '/:all*(png|jpg|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      // {
      //   protocol: 'https',
      //   hostname: process.env.NEXT_PUBLIC_HOSTNAME,
      //   port: '',
      //   pathname: '/**',
      // },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig;