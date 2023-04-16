import type { DefaultTheme } from 'vitepress'
import { getNav } from './nav'
import { getSidebar } from './sidebar'

export default (): DefaultTheme.Config => ({
  nav: getNav(),
  sidebar: getSidebar(),
  i18nRouting: true
})
