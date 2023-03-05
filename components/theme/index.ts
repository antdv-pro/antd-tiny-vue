import { createTheme, useCacheToken } from '@antd-tiny-vue/cssinjs'
import { computed } from 'vue'

export interface ThemeToken {
  primaryColor: string
}

export const defaultTheme: ThemeToken = {
  primaryColor: '#1890ff'
}

function derivative(theme: ThemeToken) {
  return {
    ...theme
  }
}

const theme = createTheme(derivative)

export const useToken = () => {
  const mergedTheme = computed(() => theme)
  const cacheToken = useCacheToken(
    mergedTheme,
    computed(() => [defaultTheme]),
    computed(() => ({
      salt: 'true'
    }))
  )
  return [mergedTheme, computed(() => cacheToken.value[0]), computed(() => cacheToken.value[1])]
}
