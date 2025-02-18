
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
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react-vendor';
            if (id.includes('redux')) return 'redux-vendor';
            if (id.includes('router')) return 'router-vendor';
            if (id.includes('@tiptap')) return 'tiptap-vendor';
            return 'vendor';
          }
          if (id.includes('src/pages/settings')) return 'settings';
          if (id.includes('src/pages/inbox')) return 'inbox';
        }
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: true,
  },
  optimizeDeps: {
    include: ['@tiptap/extension-mention', '@tiptap/suggestion'],
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

