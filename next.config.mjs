/** @type {import('next').NextConfig} */
const config = {
  poweredByHeader: false,
  experimental: { cpus: 1 },
  outputFileTracingRoot: process.cwd(),
};
export default config;
