import { hostname } from "os";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', // 🚀 Ajout de Cloudinary
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol:'https',
        hostname:'noticias.imer.mx'
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org', // Pour la carte du monde en fond
      }
    ],
  },
};

module.exports = nextConfig;