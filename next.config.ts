import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    rewrites: async () => {
        return [
            {
                source: '/api/:path*',
                destination: 'https://llmsan-api.onrender.com/api/:path*'
            },
        ];
    }
};

export default nextConfig;
