/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // İyzipay için gerekli ayarlar
      config.externals = config.externals || []
      config.externals.push({
        'iyzipay': 'commonjs iyzipay'
      })
    }
    return config
  },
  // Serverless function configuration
  serverExternalPackages: ['iyzipay'],
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript errors during build (optional)
  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig

