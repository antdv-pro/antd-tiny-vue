import { defineConfig } from 'vite'
import vueJsxPlugin from '@vitejs/plugin-vue-jsx'
import VitePluginVitepressDemo from 'vite-plugin-vitepress-demo'

export default defineConfig({
  plugins: [vueJsxPlugin(), VitePluginVitepressDemo()]
})
