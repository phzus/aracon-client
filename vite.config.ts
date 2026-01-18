import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.tsx'),
      name: 'ImoveisWidget',
      fileName: 'imoveis-widget',
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        // Ensure all code is in a single file
        inlineDynamicImports: true,
        entryFileNames: 'imoveis-widget.js',
        assetFileNames: 'imoveis-widget.[ext]',
      },
    },
    cssCodeSplit: false,
    minify: 'terser',
    cssMinify: 'esbuild', // Use esbuild for CSS minification (more compatible)
  },
})
