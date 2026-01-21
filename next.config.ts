import type { NextConfig } from "next";
import config from './config'

const landingUrl = config.LANDING_URL
const nextConfig: NextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vmlc-s3.s3.eu-north-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
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