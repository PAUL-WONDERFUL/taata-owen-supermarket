/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@prisma/client', '@prisma/adapter-pg', 'pg'],
  // Lets a phone on the same Wi-Fi load `npm run dev` (dev server only).
  allowedDevOrigins: ['192.168.100.*'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
};

module.exports = nextConfig;
