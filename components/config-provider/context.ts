import { computed, inject, provide } from 'vue'

export const defaultIconPrefixCls = 'anticon'

const defaultGetPrefixCls = (suffixCls?: string, customizePrefixCls?: string) => {
  if (customizePrefixCls) return customizePrefixCls

  return suffixCls ? `ant-${suffixCls}` : 'ant'
}

export const ConfigProviderContext = Symbol('ConfigProviderContext')

export const defaultConfigProviderState = () => {
  const getPrefixCls = defaultGetPrefixCls
  const iconPrefixCls = computed(() => defaultIconPrefixCls)
  return {
    getPrefixCls,
    iconPrefixCls
  }
}

const useProviderConfigProvide = () => {
  const defaultState = defaultConfigProviderState()
  provide(ConfigProviderContext, defaultState)
  return {
    ...defaultState
  }
}

export { useProviderConfigProvide }
export const useProviderConfigState = () => {
  return inject(ConfigProviderContext, defaultConfigProviderState())
}
