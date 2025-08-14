import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["randomuser.me"],
  },
};
module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};


export default nextConfig;
