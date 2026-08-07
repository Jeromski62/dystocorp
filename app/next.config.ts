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
  // Default is 1mb, well under MAX_PORTRAIT_BYTES (5mb) in
  // lib/supabase/dossier-portraits.ts -- without raising this, a portrait
  // upload over 1mb gets rejected by Next.js itself before the server action
  // even runs, which surfaces to the user as a broken page load instead of
  // our own size-limit error message.
  experimental: {
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
