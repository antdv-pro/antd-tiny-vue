import type { DefaultTheme } from 'vitepress'

export const getNav = (): DefaultTheme.NavItem[] => {
  return [
    {
      text: '组件',
      link: '/zh-CN/components/'
    }
  ]
}
