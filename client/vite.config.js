import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendUrl = env.VITE_API_URL || 'http://localhost:5050'

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
          headers: {
            'X-Tunnel-Skip-Anti-Phishing-Threshold': 'true',
          },
        },
        '/uploads': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
          headers: {
            'X-Tunnel-Skip-Anti-Phishing-Threshold': 'true',
          },
        },
      },
      // Allow tunnel hostnames
      allowedHosts: 'all',
    },
  }
})
