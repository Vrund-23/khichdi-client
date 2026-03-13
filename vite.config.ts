import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [
    react(), 
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'Gemini_Generated_Image_su8l5hsu8l5hsu8l.png'],
      manifest: {
        name: 'Khichdi - Daily Mess Menus',
        short_name: 'Khichdi',
        description: 'Find daily mess menus near your hostel in Vallabh Vidyanagar.',
        theme_color: '#16a34a',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/Gemini_Generated_Image_su8l5hsu8l5hsu8l.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/Gemini_Generated_Image_su8l5hsu8l5hsu8l.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/Gemini_Generated_Image_su8l5hsu8l5hsu8l.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', 'clsx', 'tailwind-merge', 'class-variance-authority', 'sonner'],
          'data-vendor': ['swr']
        }
      }
    }
  }
}));
