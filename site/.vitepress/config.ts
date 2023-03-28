import { fileURLToPath } from 'url'
import { resolve } from 'path'
import { defineConfig } from 'vitepress'
import vueJsxPlugin from '@vitejs/plugin-vue-jsx'
import { VitePluginVitepressDemo } from 'vite-plugin-vitepress-demo'
import { getNav } from './config/nav'
import { getSidebar } from './config/sidebar'
import { getRewrites } from './config/rewrites'
const baseSrc = fileURLToPath(new URL('./', import.meta.url))

export default defineConfig({
  title: 'vue3组件库站点',
  rewrites: getRewrites(),
  srcExclude: ['**/node_modules/**', '**/demos/**', '**/tests/**', '**/README.md'],
  mpa: true,
  themeConfig: {
    nav: getNav(),
    sidebar: getSidebar()
  },
  vite: {
    plugins: [
      vueJsxPlugin(),
      VitePluginVitepressDemo({
        glob: ['**/demos/**/*.vue']
      })
    ],
    resolve: {
      alias: {
        'antd-tiny-vue': resolve(baseSrc, '../../components')
      }
    }
  }
})
