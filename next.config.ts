import type { NextConfig } from "next";

/** Backend for /api/* rewrites (server-side). Override with BACKEND_URL on Vercel/Render. */
const backendUrl =
  process.env.BACKEND_URL?.replace(/\/$/, "") ||
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  (process.env.VERCEL === "1"
    ? "https://v-five-education.onrender.com"
    : "http://localhost:8000");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
