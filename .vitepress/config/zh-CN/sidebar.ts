import type { DefaultTheme } from 'vitepress'
const componentsDir = `/zh-CN/components/`

export const getSidebar = (): DefaultTheme.Sidebar => {
  return {
    [componentsDir]: [
      {
        text: '通用',
        items: [
          {
            text: 'Button 按钮',
            link: `${componentsDir}button/`
          }
        ]
      },
      {
        text: '布局',
        items: []
      },
      {
        text: '导航',
        items: []
      },
      {
        text: '数据入录',
        items: []
      },
      {
        text: '数据展示',
        items: []
      },
      {
        text: '反馈',
        items: []
      },
      {
        text: '其他',
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
