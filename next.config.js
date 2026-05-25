/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || process.env.NEXT_APP_PAYSTACK_PUBLIC_KEY || 'pk_live_7b06579b36d563071a5f0bfa266b79be10695eff',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
  },
  images: {
    domains: ['localhost', 'kejaluxinteriors.onrender.com']
  }
}

module.exports = nextConfig
