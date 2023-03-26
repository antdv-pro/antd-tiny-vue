import { booleanType, objectType, someType, stringType } from '@v-c/utils'
import type { App, ExtractPropTypes } from 'vue'
import { computed, defineComponent } from 'vue'
import { createTheme } from '@antd-tiny-vue/cssinjs'
import defaultSeedToken from '../theme/themes/seed'
import type { DesignTokenConfig } from '../theme/internal'
import { DesignTokenProviderContext } from '../theme/internal'
import type { CSPConfig, ConfigConsumerProps, DirectionType, SizeType, Theme, ThemeConfig } from './context'
import { configConsumerProps, defaultIconPrefixCls, useProviderConfigProvide } from './context'
import { registerTheme } from './css-variables'
import type { RenderEmptyHandler } from './default-render-empty'

import useStyle from './style'
import { useConfig } from './hooks/config'
export type { RenderEmptyHandler, CSPConfig, DirectionType, ConfigConsumerProps, ThemeConfig }

export { defaultIconPrefixCls }
export const configProviderProps = {
  ...configConsumerProps,
  prefixCls: stringType(),
  componentSize: someType<SizeType>([String]),
  componentDisabled: booleanType(),
  legacyLocale: objectType()
}

export type ConfigProviderProps = Partial<ExtractPropTypes<typeof configProviderProps>>

export const defaultPrefixCls = 'ant'

// These props is used by `useContext` directly in sub component
// const PASSED_PROPS: Exclude<keyof ConfigConsumerProps, 'rootPrefixCls' | 'getPrefixCls'>[] = [
//   'getTargetContainer',
//   'getPopupContainer',
//   'renderEmpty',
//   'pageHeader',
//   'input',
//   'pagination',
//   'form',
//   'select'
// ]

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

const ConfigProvider = defineComponent({
  name: 'AConfigProvider',
  props: {
    ...configProviderProps
  },
  setup(props, { slots }) {
    // 依赖注入
    const { shouldWrapSSR, iconPrefixCls } = useProviderConfigProvide(props)
    const wrapSSR = useStyle(iconPrefixCls)
    const memoTheme = computed(() => {
      const { algorithm, token, ...rest } = props.theme || {}
      const themeObj = algorithm && (!Array.isArray(algorithm) || algorithm.length > 0) ? createTheme(algorithm) : undefined
      return {
        ...rest,
        theme: themeObj,
        token: {
          ...defaultSeedToken,
          ...token
        }
      }
    })

    return () => {
      const { locale, theme } = props
      const children = slots.default?.()
      let childNode = shouldWrapSSR.value ? wrapSSR(children) : children

      /**
       * Form
       */
      // const validateMessages = React.useMemo(
      //   () =>
      //     setValues(
      //       {},
      //       defaultLocale.Form?.defaultValidateMessages || {},
      //       memoedConfig.locale?.Form?.defaultValidateMessages || {},
      //       form?.validateMessages || {},
      //     ),
      //   [memoedConfig, form?.validateMessages],
      // );
      //
      // if (Object.keys(validateMessages).length > 0) {
      //   childNode = <RcFormProvider validateMessages={validateMessages}>{children}</RcFormProvider>;
      // }
      /**
       * 多语言实现部分
       */
      if (locale) {
        //   多语言部分
        //   childNode = <LocaleProvider locale={locale}>{childNode}</LocaleProvider>;
      }

      if (theme) {
        childNode = (
          <DesignTokenProviderContext
            {...(memoTheme.value as DesignTokenConfig)}
            token={memoTheme.value.token as any}
          >
            {childNode}
          </DesignTokenProviderContext>
        )
      }

      return childNode
    }
  }
})

ConfigProvider.install = (app: App) => {
  app.component(ConfigProvider.name, ConfigProvider)
}

ConfigProvider.config = setGlobalConfig

ConfigProvider.useConfig = useConfig
export default ConfigProvider as typeof ConfigProvider & {
  install(app: App): void
  config: typeof setGlobalConfig
  useConfig: typeof useConfig
}
