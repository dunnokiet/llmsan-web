import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    rewrites: async () => {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:8000/api/:path*'
            },
        ];
    }
};

export default nextConfig;
