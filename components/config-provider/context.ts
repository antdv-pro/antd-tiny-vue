import { booleanType, createInjectionState, functionType, objectType, someType, stringType } from '@v-c/utils'
import type { ExtractPropTypes } from 'vue'
import { computed } from 'vue'
import type { DerivativeFunc } from '@antd-tiny-vue/cssinjs'
import type { AliasToken, MapToken, OverrideToken, SeedToken } from '../theme/interface'
import type { RenderEmptyHandler } from './default-render-empty'

export type SizeType = 'small' | 'middle' | 'large' | undefined

export interface Theme {
  primaryColor?: string
  infoColor?: string
  successColor?: string
  processingColor?: string
  errorColor?: string
  warningColor?: string
}

export interface CSPConfig {
  nonce?: string
}

export type DirectionType = 'ltr' | 'rtl' | undefined

export type MappingAlgorithm = DerivativeFunc<SeedToken, MapToken>

export interface ThemeConfig {
  token?: Partial<AliasToken>
  components?: OverrideToken
  algorithm?: MappingAlgorithm | MappingAlgorithm[]
  hashed?: boolean
  inherit?: boolean
}
export const defaultIconPrefixCls = 'anticon'

const defaultGetPrefixCls = (suffixCls?: string, customizePrefixCls?: string) => {
  if (customizePrefixCls) return customizePrefixCls

  return suffixCls ? `ant-${suffixCls}` : 'ant'
}

export const configConsumerProps = {
  getTargetContainer: functionType<() => HTMLElement>(),
  getPopupContainer: functionType<(triggerNode?: HTMLElement) => HTMLElement>(),
  rootPrefixCls: stringType(),
  iconPrefixCls: stringType(defaultIconPrefixCls),
  getPrefixCls: functionType(defaultGetPrefixCls),
  renderEmpty: functionType<RenderEmptyHandler>(),
  csp: objectType<CSPConfig>(),
  autoInsertSpaceInButton: booleanType(),
  input: objectType<{
    autoComplete?: string
  }>(),
  pagination: objectType<{
    showSizeChanger?: boolean
  }>(),
  locale: objectType(),
  pageHeader: objectType<{
    ghost: boolean
  }>(),
  direction: someType<DirectionType>([String]),
  space: objectType<{
    size?: SizeType | number
  }>(),
  virtual: booleanType(),
  dropdownMatchSelectWidth: booleanType(),
  form: objectType<{
    // requiredMark?: RequiredMark
    colon?: boolean
    // scrollToFirstError?: Options | boolean
  }>(),
  theme: objectType<ThemeConfig>(),
  select: objectType<{
    showSearch?: boolean
  }>()
}

export type ConfigConsumerProps = ExtractPropTypes<typeof configConsumerProps>

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
