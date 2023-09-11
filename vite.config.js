import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: { 'src': path.resolve(__dirname, './src') },
},
  plugins: [svgr(), react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
})
