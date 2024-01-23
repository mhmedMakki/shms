/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['shms-uploads.s3.eu-west-2.amazonaws.com', 'source.unsplash.com']
  }
}

module.exports = nextConfig
