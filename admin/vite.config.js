import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// Separate app from the client site — runs on its own port so both dev
// servers can be up at once (client: 5173, admin: 5174).
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(process.cwd(), 'src') },
  },
  server: { port: 5174 },
  preview: { port: 5174 },
})
