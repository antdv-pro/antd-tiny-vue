import type { DefaultTheme } from 'vitepress'

export const getNav = (): DefaultTheme.NavItem[] => {
  return [
    {
      text: 'Components',
      link: '/components/'
    }
  ]
}
