import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),

    VitePWA({
      scope:"/",
      // Service Worker 用のファイルを自前で準備
      strategies: "injectManifest",
      // Service Worker として、登録したいファイルを設定
      srcDir: "service-worker",
      filename: "serviceWorker.ts",
      // Service Worker は手動で登録するので false にする
      injectRegister: false,
      // PWA は使用しないので、manifest は不要
      manifest: false,
      injectManifest: {
        injectionPoint: undefined,
      },
      // 開発環境で Service Worker が動くようにする
      // また、開発環境では ESM で動かす。
      devOptions: {
        enabled: true,
        type: "module",
      },
    })



  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
