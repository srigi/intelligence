import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
  publicDir: path.resolve(__dirname, './src'),
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
});
