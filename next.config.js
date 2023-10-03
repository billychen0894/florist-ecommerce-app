/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'tailwindui.com',
      'lh3.googleusercontent.com',
      'res.cloudinary.com',
      'images.unsplash.com',
    ],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
