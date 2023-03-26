import { booleanType, someType, stringType, vNodeType } from '@v-c/utils'
import type { ExtractPropTypes } from 'vue'
import type { SizeType } from '../config-provider/context'
import type { ButtonHTMLType, ButtonShape, ButtonType } from './button-helper'
export interface LoadingConfigType {
  loading: boolean
  delay: number
}

export const buttonProps = {
  type: stringType<ButtonType>('default'),
  icon: vNodeType(),
  shape: stringType<ButtonShape>(),
  size: someType<SizeType | 'default'>([String], 'default'),
  disabled: booleanType(),
  loading: someType<boolean | LoadingConfigType>(),
  prefixCls: stringType(),
  rootClassName: stringType(),
  ghost: booleanType(),
  danger: booleanType(),
  block: booleanType(),
  htmlType: stringType<ButtonHTMLType>('button')
}

export type ButtonProps = ExtractPropTypes<typeof buttonProps>
