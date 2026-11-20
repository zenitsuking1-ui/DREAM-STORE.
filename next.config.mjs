/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    agentUpgrade: "security",
  },
  // Standalone output is only needed by the Docker image. Vercel and local
  // `next start` use the regular Next.js build output.
  output: process.env.DOCKER_BUILD === "1" ? "standalone" : undefined,
  images: {
    unoptimized: true,
  },
}

export default nextConfig
