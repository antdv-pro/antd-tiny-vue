import type { App, Plugin } from 'vue'
import * as components from './components'
import version from './version'
export * from './components'

export default {
  install(app: App) {
    Object.values(components).forEach(component => {
      if (component.install) {
        app.use(component as any)
      }
    })
  },
  version
} as Plugin
