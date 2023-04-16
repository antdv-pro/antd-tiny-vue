import type { DefaultTheme } from 'vitepress'
const componentsDir = `/zh-CN/components/`

export const getSidebar = (): DefaultTheme.Sidebar => {
  return {
    '/zh-CN/components/': [
      {
        text: 'Button 按钮',
        link: `${componentsDir}button/`
      },
      {
        text: 'ConfigProvider',
        link: `${componentsDir}config-provider/`
      }
    ]
  }
}
