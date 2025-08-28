/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Adding a Next API route as a middle layer is optional
  // and only worth it if we need extra logic (auth, rate limits, secret handling).
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3001/:path*",
      },
    ];
  },
};

export default nextConfig;
