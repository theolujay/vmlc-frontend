import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: '/register',
        destination: 'https://verboheit.org/register',
        permanent: true,
      },
      {
        source: '/register/staff',
        destination: 'https://verboheit.org/register?type=volunteer',
        permanent: true,
      },
    ]
  },
}

export default nextConfig;