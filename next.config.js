const fs = require('fs');
const path = require('path');

// ── Load .env.local exactly like pulse-ai (proven working) ───────────────────
try {
  const envFile = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
  envFile.split(/\r?\n/).forEach(line => {
    const match = line.match(/^([^=#][^=]*)=(.+)$/);
    if (match) process.env[match[1].trim()] = match[2].trim();
  });
  console.log('[next.config.js] .env.local loaded, ANTHROPIC_API_KEY set:', !!process.env.ANTHROPIC_API_KEY);
} catch (e) {
  console.warn('[next.config.js] Could not load .env.local:', e.message);
}

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
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
