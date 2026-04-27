import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "books.google.com",
      },
      {
        protocol: "https",
        hostname: "**"
      }
    ]
  }
};

module.exports = {
  allowedDevOrigins: ['127.0.0.1'],
}

export default nextConfig;
