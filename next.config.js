/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: ['./src'],
    prependData: `@import "@vending-machine/styles/global.scss";`,
  },
};

module.exports = nextConfig;
