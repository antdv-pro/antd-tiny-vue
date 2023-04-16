import type { DefaultTheme } from 'vitepress'

const componentsDir = `/components/`

export const getSidebar = (): DefaultTheme.Sidebar => {
  return {
    '/components/': [
      {
        text: 'Button',
        link: `${componentsDir}button/`
      },
      {
        text: 'ConfigProvider',
        link: `${componentsDir}config-provider/`
      }
    ]
  }
}
