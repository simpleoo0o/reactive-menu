import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), cssInjectedByJsPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      external: ['lodash-es', 'vue', 'element-plus', 'vue-router'],
      output: {
        manualChunks: undefined,
        globals: {
          'lodash-es': '_',
          vue: 'Vue',
          'vue-router': 'VueRouter',
          'element-plus': 'ElementPlus'
        }
      }
    },
    cssCodeSplit: true,
    lib: {
      entry: './src/reactive-menu.ts',
      formats: ['es', 'cjs', 'iife'],
      name: 'ReactiveMenu',
      fileName: 'reactive-menu'
    }
  },
  server: {
    host: true
  }
})
