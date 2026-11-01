import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { githubPagesSpa } from '@sctg/vite-plugin-github-pages-spa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), githubPagesSpa()],
  base: '/Shopping-Cart-Odin-Project/',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: false,
  },
})
