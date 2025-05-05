import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins:[],
  reactStrictMode: true,
  eslint:{
       ignoreDuringBuilds:true
  },
  images: {
    remotePatterns: [new URL('https://cinnasium.com/media/**')],
  },
};

export default nextConfig;
