import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue({
    template: {
      compilerOptions: {
        isCustomElement: (tag) => ['person-details', 'another-element', 'el-label', 'arrow-down', 'arrow-up'].includes(tag)
      }
    }
  })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
});
