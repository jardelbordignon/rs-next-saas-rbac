import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'github.com' },
      { hostname: 'avatars.githubusercontent.com' },
      { hostname: 'platform-lookaside.fbsbx.com' },
    ],
  },
  output: 'standalone',
}

export default nextConfig
