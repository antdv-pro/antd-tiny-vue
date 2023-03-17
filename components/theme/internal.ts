import type { CSSInterpolation, Theme } from '@antd-tiny-vue/cssinjs'
import { createTheme, useCacheToken, useStyleRegister } from '@antd-tiny-vue/cssinjs'
import type { ComputedRef, VNodeChild } from 'vue'
import { computed, inject, provide } from 'vue'
import version from '../version'
import type { AliasToken, GlobalToken, MapToken, OverrideToken, PresetColorKey, PresetColorType, SeedToken } from './interface'
import { PresetColors } from './interface'
import defaultDerivative from './themes/default'
import defaultSeedToken from './themes/seed'
import formatToken from './util/alias'
import type { FullToken } from './util/genComponentStyleHook'
import genComponentStyleHook from './util/genComponentStyleHook'
import statisticToken, { merge as mergeToken, statistic } from './util/statistic'

const defaultTheme = createTheme(defaultDerivative)

export {
  // colors
  PresetColors,
  // Statistic
  statistic,
  statisticToken,
  mergeToken,
  // hooks
  useStyleRegister,
  genComponentStyleHook
}
export type {
  SeedToken,
  AliasToken,
  PresetColorType,
  PresetColorKey,
  // FIXME: Remove this type
  FullToken,
  AliasToken as DerivativeToken
}

// ================================ Context =================================
// To ensure snapshot stable. We disable hashed in test env.
export const defaultConfig: DesignTokenConfig = {
  token: defaultSeedToken,
  hashed: true
}

export interface DesignTokenConfig {
  token: Partial<AliasToken>
  theme?: Theme<SeedToken, MapToken>
  components?: OverrideToken
  hashed?: string | boolean
}

export const DesignTokenContext = Symbol('DesignTokenContext')

const useDesignTokenProvider = (token: DesignTokenConfig) => {
  provide(DesignTokenContext, token)
}

export { useDesignTokenProvider }
export const useDesignTokenState = () => inject(DesignTokenContext, defaultConfig)

// ================================== Hook ==================================
export function useToken(): [ComputedRef<Theme<SeedToken, MapToken>>, ComputedRef<GlobalToken>, ComputedRef<string>] {
  const designTokenContext = useDesignTokenState()
  const salt = computed(() => `${version}-${designTokenContext.hashed || ''}`)

  const mergedTheme = computed(() => designTokenContext.theme || defaultTheme)
  const tokens = computed(() => [defaultSeedToken, designTokenContext.token])
  const opt = computed(() => {
    return {
      salt: salt.value,
      override: { override: designTokenContext.token, ...designTokenContext.components },
      formatToken
    }
  })

  const cacheToken = useCacheToken<GlobalToken, SeedToken>(mergedTheme, tokens, opt)

  return [mergedTheme, computed(() => cacheToken.value?.[0]), computed(() => (designTokenContext.hashed ? cacheToken.value?.[1] : ''))]
}

export type UseComponentStyleResult = [(node: VNodeChild) => VNodeChild, ComputedRef<string>]

export type GenerateStyle<ComponentToken extends object = AliasToken, ReturnType = CSSInterpolation> = (token: ComponentToken) => ReturnType
