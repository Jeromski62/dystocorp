import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fpzmrkhczfdvsptcjzgi.supabase.co",
        pathname: "/storage/v1/object/public/dossier-portraits/**",
      },
    ],
  },
};

export default nextConfig;
