const fs = require('fs');
const path = require('path');

function loadEnv() {
  // Priority order: .env.local overrides .env (mirrors Next.js convention)
  const envFiles = ['.env.local', '.env'];
  for (const filename of envFiles) {
    const envPath = path.join(__dirname, filename);
    try {
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        for (const line of content.split('\n')) {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
            const eqIdx = trimmed.indexOf('=');
            const key = trimmed.slice(0, eqIdx).trim();
            const value = trimmed.slice(eqIdx + 1).trim();
            // Only set if not already defined (first file wins)
            if (key && !process.env[key]) {
              process.env[key] = value;
            }
          }
        }
        console.log(`[next.config] Loaded env from ${filename}`);
      }
    } catch (err) {
      console.error(`[next.config] Error loading ${filename}:`, err);
    }
  }
}

loadEnv();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Prevent server-only packages from being bundled for the browser
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
