import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins:[],
  reactStrictMode: true,
  eslint:{
       ignoreDuringBuilds:true
  }
};

export default nextConfig;
