export const getRewrites = (): Record<string, string> => {
  return {
    'site/index.md': 'index.md',
    'site/index.zh-CN.md': 'zh-CN/index.md',
    'site/components/index.md': 'components/index.md',
    'site/components/index.zh-CN.md': 'zh-CN/components/index.md',
    'components/:comp/index.zh-CN.md': 'zh-CN/components/:comp/index.md'
  }
}
