import type { App } from 'vue'
import * as components from './components'
import version from './version'

export default {
  install(app: App) {
    for (const componentsKey in components) {
      const component = (components as any)[componentsKey]
      if (component.install) {
        app.use(component)
      }
    }
  },
  version
}
