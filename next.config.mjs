/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["graphql"], // fix for graphql issue with nextjs as gotten from https://github.com/neo4j/graphql/issues/4297
  },
};

export default nextConfig;