import { booleanType, someType, stringType } from '@v-c/utils'
import type { ExtractPropTypes } from 'vue'
import type { SizeType, Theme } from './context'
import { configConsumerProps, defaultIconPrefixCls } from './context'
import { registerTheme } from './css-variables'

export const configProviderProps = {
  ...configConsumerProps,
  prefixCls: stringType(),
  componentSize: someType<SizeType>([String]),
  componentDisabled: booleanType()
}

export type ConfigProviderProps = Partial<ExtractPropTypes<typeof configProviderProps>>

export const defaultPrefixCls = 'ant'
let globalPrefixCls: string
let globalIconPrefixCls: string

function getGlobalPrefixCls() {
  return globalPrefixCls || defaultPrefixCls
}

function getGlobalIconPrefixCls() {
  return globalIconPrefixCls || defaultIconPrefixCls
}

export const setGlobalConfig = ({ prefixCls, iconPrefixCls, theme }: Pick<ConfigProviderProps, 'prefixCls' | 'iconPrefixCls'> & { theme?: Theme }) => {
  if (prefixCls !== undefined) {
    globalPrefixCls = prefixCls
  }
  if (iconPrefixCls !== undefined) {
    globalIconPrefixCls = iconPrefixCls
  }

  if (theme) {
    registerTheme(getGlobalPrefixCls(), theme)
  }
}

export const globalConfig = () => ({
  getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => {
    if (customizePrefixCls) return customizePrefixCls
    return suffixCls ? `${getGlobalPrefixCls()}-${suffixCls}` : getGlobalPrefixCls()
  },
  getIconPrefixCls: getGlobalIconPrefixCls,
  getRootPrefixCls: () => {
    // If Global prefixCls provided, use this
    if (globalPrefixCls) {
      return globalPrefixCls
    }

    // Fallback to default prefixCls
    return getGlobalPrefixCls()
  }
})
