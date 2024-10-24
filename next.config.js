/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['localhost', 'pleasurebd.com', 'img.drz.lazcdn.com'],
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    reactStrictMode: true,
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                punycode: false,
            };
        }
        return config;
    },
    onError: (error, errorInfo) => {
        console.log('NextJS Error:', error, errorInfo);
    },
}

module.exports = nextConfig
