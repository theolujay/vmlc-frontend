import type { NextConfig } from "next";
import config from './config'

const landingUrl = config.LANDING_URL
const nextConfig: NextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: '/register',
        destination: `${landingUrl}/register`,
        permanent: true,
      },
      {
        source: '/register/staff',
        destination: `${landingUrl}/register?type=volunteer`,
        permanent: true,
      },
    ]
  },
}

export default nextConfig;