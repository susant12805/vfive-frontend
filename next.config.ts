import type { NextConfig } from "next";

const PRODUCTION_BACKEND = "https://api.vfiveeducation.com.np";

function resolveBackendUrl(): string {
  const candidates = [
    process.env.BACKEND_URL,
    process.env.NEXT_PUBLIC_API_URL,
  ]
    .map((v) => v?.trim().replace(/\/$/, ""))
    .filter(Boolean) as string[];

  const valid = candidates.find((u) => !u.includes("localhost") && !u.includes("127.0.0.1"));
  if (valid) return valid;

  return process.env.VERCEL === "1" ? PRODUCTION_BACKEND : "http://localhost:8000";
}

const backendUrl = resolveBackendUrl();

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
