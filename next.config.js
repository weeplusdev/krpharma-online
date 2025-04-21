/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ปิดการใช้งาน TypeScript checking ระหว่างการสร้าง
    ignoreBuildErrors: true,
  },
  eslint: {
    // ปิดการใช้งาน ESLint ระหว่างการสร้าง
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig; 