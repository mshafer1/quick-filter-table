import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// Import 'path' module for resolving aliases
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  define: {
    'process.env': {},
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      vue: path.resolve(__dirname, 'node_modules/vue/dist/vue.esm-bundler.js'),
    },
  },
  formats: ['umd', 'iife'],
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/libray.js', import.meta.url)),
      name: 'QuickFilterTable',
      fileName: (format) => `library.js`,
    },
    rollupOptions: {
      output: {
        // globals: {
        //   vue: 'Vue',
        // },
        external: [],
      },
    },
  },
})
