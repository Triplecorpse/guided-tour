import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: { additionalData: "$var: red;" }, //todo: investigate what additionalData is,
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
