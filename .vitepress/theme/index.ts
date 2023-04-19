import type { Theme } from 'vitepress'
// eslint-disable-next-line import/no-named-as-default
import DefaultTheme from 'vitepress/theme'
import AntdTheme from '../components/demo.vue'
// import { AntdTheme } from 'vite-plugin-vitepress-demo/theme'
export default {
  ...DefaultTheme,
  async enhanceApp(ctx) {
    DefaultTheme.enhanceApp?.(ctx)
    ctx.app.component('Demo', AntdTheme)
    // @ts-expect-error this is a local module
    if (!import.meta.env.SSR) {
      // @ts-expect-error this is a local module
      const Antd = (await import('antd-tiny-vue')).default
      ctx.app.use(Antd)
    }
  }
} as Theme
