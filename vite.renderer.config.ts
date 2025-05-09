import { defineConfig } from 'vite';
import path from 'node:path';

// https://vitejs.dev/config
export default defineConfig({
  publicDir: path.resolve(__dirname, './src'),
});
