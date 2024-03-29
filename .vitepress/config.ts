import { fileURLToPath } from 'url'
import { resolve } from 'path'
import { defineConfig } from 'vitepress'
import vueJsxPlugin from '@vitejs/plugin-vue-jsx'
import VitePluginVitepressDemo from 'vite-plugin-vitepress-demo'
import getEnUSConfig from './config/en-US'
import getZhCNConfig from './config/zh-CN'
import { getRewrites } from './config/rewrites'
const baseSrc = fileURLToPath(new URL('./', import.meta.url))

export default defineConfig({
  rewrites: getRewrites(),
  lang: 'en-US',
  ignoreDeadLinks: true,
  locales: {
    'zh-CN': {
      lang: 'zh-CN',
      title: 'Antd Tiny Vue',
      label: '简体中文',
      description: 'vue3组件库站点',
      themeConfig: getZhCNConfig()
    },
    root: {
      lang: 'en-US',
      title: 'Antd Tiny Vue',
      label: 'English',
      description: 'vue3 component library site',
      themeConfig: getEnUSConfig()
    }
  },
  vite: {
    plugins: [vueJsxPlugin(), VitePluginVitepressDemo()],
    resolve: {
      alias: {
        'antd-tiny-vue': resolve(baseSrc, '../components')
      }
    },
    server: {
      port: 1199
    }
  }
})
