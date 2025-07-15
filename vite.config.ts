import { defineConfig } from 'vite';

export default defineConfig({
  root: '.', // 根目录就是当前目录
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: 'index.html'
    }
  },
  resolve: {
    alias: {
      '@models': '/models',
      '@data': '/data',
      '@src':'/src'
    }
  }
});
