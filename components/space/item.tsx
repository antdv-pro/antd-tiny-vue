import {
  booleanType,
  filterEmpty,
  numberType,
  someType,
  stringType,
  vNodeType
} from '@v-c/utils'
import type { CSSProperties, ExtractPropTypes, VNodeChild } from 'vue'
import { defineComponent } from 'vue'
import { useSpaceContextState } from './index'

export const itemProps = {
  className: stringType(),
  children: vNodeType(),
  index: numberType(),
  direction: stringType<'horizontal' | 'vertical'>(),
  marginDirection: stringType<'marginLeft' | 'marginRight'>(),
  split: someType<string | (() => VNodeChild) | VNodeChild>([
    String,
    Function,
    Object
  ]),
  wrap: booleanType()
}

export type ItemProps = ExtractPropTypes<typeof itemProps>

const Item = defineComponent({
  name: 'VcSpaceItem',
  props: itemProps,
  setup(props, { attrs, slots }) {
    const { supportFlexGap, latestIndex, verticalSize, horizontalSize } =
      useSpaceContextState()
    return () => {
      const { direction, index, marginDirection, split, wrap } = props
      const children = slots.default?.()
      if (!children || filterEmpty(children).length === 0) {
        return null
      }
      let style: CSSProperties = {}
      if (!supportFlexGap.value) {
        if (direction === 'vertical') {
          if (index < latestIndex.value) {
            style.marginBottom = `${horizontalSize.value / (split ? 2 : 1)}px`
          }
        } else {
          style = {
            ...(index < latestIndex.value &&
              ({
                [marginDirection]: `${horizontalSize.value / (split ? 2 : 1)}px`
              } as CSSProperties)),
            ...(wrap && { paddingBottom: `${verticalSize.value}px` })
          }
        }
      }

      return (
        <>
          <div class={attrs.class} style={style}>
            {children}
          </div>
          {index < latestIndex.value && split && (
            <span class={`${attrs.class}-split`} style={style}>
              {split}
            </span>
          )}
        </>
      )
    }
  }
})

export default Item
