import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const MODE = process.env.NODE_ENV

export default defineConfig({
  build: {
    cssMinify: MODE === 'production',
    target: 'es2023',
  },
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    port: Number(process.env.PORT || 3000),
  },
})
