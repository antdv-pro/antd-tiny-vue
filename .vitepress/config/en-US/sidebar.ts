import type { DefaultTheme } from 'vitepress'

const componentsDir = `/components/`

export const getSidebar = (): DefaultTheme.Sidebar => {
  return {
    [componentsDir]: [
      {
        text: 'General',
        items: [
          {
            text: 'Button',
            link: `${componentsDir}button/`
          }
        ]
      },
      {
        text: 'Layout',
        items: []
      },
      {
        text: 'Navigation',
        items: []
      },
      {
        text: 'Data Entry',
        items: []
      },
      {
        text: 'Data Display',
        items: []
      },
      {
        text: 'Feedback',
        items: []
      },
      {
        text: 'Other',
        items: [
          {
            text: 'ConfigProvider',
            link: `${componentsDir}config-provider/`
          }
        ]
      }
    ]
  }
}
