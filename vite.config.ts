import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'DormiLife',
        short_name: 'Dormi',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        // TODO: public/ 에 아이콘을 추가한 뒤 주석을 해제하세요
        // icons: [
        //   { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
        //   { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        // ],
      },
    }),
  ],
})
