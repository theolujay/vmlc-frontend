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
      {
        protocol: 'https',
        hostname: 'vmlc-s3.s3.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'vmlc-prod.s3.eu-central-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'vmlc-staging.s3.eu-central-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'https://vmlc-prod.s3.amazonaws.com',
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