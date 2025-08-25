import type { NextConfig } from "next";
import { i18n } from "./next-i18next.config";

const nextConfig: NextConfig = {
  sassOptions: { additionalData: "$var: red;" }, //todo: investigate what additionalData is,
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
