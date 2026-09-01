import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://www.psychofolio.com https://psychofolio.com",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
