import { defineConfig } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
export default defineConfig({
  plugins: [vueJsx()],
  build: {
    lib: {
      entry: 'components/index.ts',
      name: 'Antd',
      fileName: () => `antd.js`,
      formats: ['umd']
    }
  }
})
