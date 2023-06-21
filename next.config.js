/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['tailwindui.com', 'api.unsplash.com', 'images.unsplash.com'],
  },
};

module.exports = nextConfig;
