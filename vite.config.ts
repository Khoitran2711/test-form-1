
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // 'base' giúp các file script/css tìm đúng đường dẫn khi deploy lên github.io/repo-name/
  base: './',
  define: {
    'process.env': process.env
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
});
