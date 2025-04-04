
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    chunkSizeWarningLimit: 1500,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-components': ['@/components/ui'],
          'redux': ['@reduxjs/toolkit', 'react-redux'],
          'auth': ['@/utils/auth', '@/store/slices/auth']
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      '@tiptap/extension-mention', 
      '@tiptap/suggestion',
      'react',
      'react-dom',
      'react-router-dom',
      '@reduxjs/toolkit',
      'react-redux',
      'axios',
      'jwt-decode'
    ],
    esbuildOptions: {
      target: 'es2020',
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
    },
    dedupe: ['react', 'react-dom']
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
}));
