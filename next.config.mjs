/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      NEXT_PUBLIC_API_URL: process.env.API_URL,
      NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV
  },
};

export default nextConfig;
