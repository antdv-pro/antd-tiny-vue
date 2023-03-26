import { booleanType, createInjectionState, functionType, objectType, someType, stringType } from '@v-c/utils'
import type { ExtractPropTypes } from 'vue'
import { computed } from 'vue'
import type { DerivativeFunc } from '@antd-tiny-vue/cssinjs'
import type { AliasToken, MapToken, OverrideToken, SeedToken } from '../theme/interface'
import type { RenderEmptyHandler } from './default-render-empty'
import type { ConfigProviderProps } from './index'

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

const configState = (props: ConfigProviderProps) => {
  const getPrefixCls = (suffixCls?: string, customizePrefixCls?: string) => {
    const { prefixCls, getPrefixCls } = props
    if (customizePrefixCls) return customizePrefixCls
    const mergedPrefixCls = prefixCls || getPrefixCls?.('') || defaultGetPrefixCls('')
    return suffixCls ? `${mergedPrefixCls}-${suffixCls}` : mergedPrefixCls
  }
  const iconPrefixCls = computed(() => props?.iconPrefixCls ?? defaultIconPrefixCls)
  const shouldWrapSSR = computed(() => iconPrefixCls.value !== defaultIconPrefixCls)
  const csp = computed(() => props?.csp)
  const componentSize = computed(() => props?.componentSize)
  const componentDisabled = computed(() => props?.componentDisabled)
  return {
    getPrefixCls,
    iconPrefixCls,
    shouldWrapSSR,
    csp,
    componentSize,
    componentDisabled
  }
}
const [useProviderConfigProvide, useProviderConfigInject] = createInjectionState(configState)

export { useProviderConfigProvide }
export const useProviderConfigState = (): ReturnType<typeof configState> => {
  return (
    useProviderConfigInject() ??
    ({
      getPrefixCls: defaultGetPrefixCls,
      iconPrefixCls: computed(() => defaultIconPrefixCls)
    } as any)
  )
}
