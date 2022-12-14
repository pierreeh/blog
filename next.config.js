/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['lh3.googleusercontent.com'],
  },
  experimental: {
    scrollRestoration: true,
  },
}

module.exports = nextConfig
