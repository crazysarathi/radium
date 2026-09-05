import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// Two pages in one project:
//   /        → index.html        → src/main.jsx        (public site)
//   /admin/  → admin/index.html  → src/admin/main.jsx  (admin console)
// Each page keeps its own HashRouter, stylesheet and Tailwind config, so the
// admin routes (/admin/#/login, /admin/#/products, …) are unchanged from the
// standalone app.
export default defineConfig({
  plugins: [
    react(),
    {
      // Dev-only: `/admin` (no trailing slash) would otherwise fall back to
      // the site's index.html. Send it to the admin page instead.
      name: 'admin-trailing-slash',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/admin' || req.url.startsWith('/admin?') || req.url.startsWith('/admin#')) {
            res.statusCode = 302
            res.setHeader('Location', '/admin/' + req.url.slice('/admin'.length))
            return res.end()
          }
          next()
        })
      },
    },
  ],
  resolve: {
    alias: { '@': path.resolve(process.cwd(), 'src') },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(process.cwd(), 'index.html'),
        admin: path.resolve(process.cwd(), 'admin/index.html'),
      },
    },
  },
})
