import { createInjectionState } from '@v-c/utils'
import { computed } from 'vue'

export type SizeType = 'small' | 'middle' | 'large' | undefined

export const defaultIconPrefixCls = 'anticon'

const defaultGetPrefixCls = (suffixCls?: string, customizePrefixCls?: string) => {
  if (customizePrefixCls) return customizePrefixCls

  return suffixCls ? `ant-${suffixCls}` : 'ant'
}
const [useProviderConfigProvide, useProviderConfigInject] = createInjectionState(() => {
  const getPrefixCls = defaultGetPrefixCls
  const iconPrefixCls = computed(() => defaultIconPrefixCls)
  return {
    getPrefixCls,
    iconPrefixCls
  }
})

export { useProviderConfigProvide }
export const useProviderConfigState = () => {
  return (
    useProviderConfigInject() ?? {
      getPrefixCls: defaultGetPrefixCls,
      iconPrefixCls: computed(() => defaultIconPrefixCls)
    }
  )
}
