/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async redirects() {
    return [
      { source: '/about', destination: '/website/about', permanent: true },
      { source: '/portfolio', destination: '/projects', permanent: true },
      { source: '/orders', destination: '/requests?tab=quotes', permanent: true },
      { source: '/consultations', destination: '/requests?tab=consultations', permanent: true },
      { source: '/blogs-faqs', destination: '/blog', permanent: true },
    ];
  },
  async rewrites() {
    return [
      {
        // Proxy all /api routes to Express backend EXCEPT NextAuth internal routes (/api/auth/*)
        source: '/api/:path((?!auth(?:/|$)).*)',
        destination: `${process.env.BACKEND_INTERNAL_URL || 'http://localhost:5000'}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
