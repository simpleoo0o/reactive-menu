import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      external: ['lodash', 'vue', 'element-plus'],
      output: {
        globals: {
          lodash: '_',
          vue: 'Vue',
          'element-plus': 'ElementPlus'
        }
      }
    },
    cssCodeSplit: true,
    lib: {
      entry: './src/lib-main.js',
      formats: ['umd'],
      name: 'ReactiveMenu',
      fileName: 'reactive-menu'
    }
  },
  server: {
    host: true
  }
})
