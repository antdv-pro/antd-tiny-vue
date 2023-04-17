import {
  anyType,
  booleanType,
  classNames,
  createInjectionState,
  filterEmpty,
  isObject,
  stringType,
  vNodeType
} from '@v-c/utils'
import type { App, CSSProperties } from 'vue'
import { computed, defineComponent, shallowRef } from 'vue'
import type { SizeType } from '../config-provider/context'
import { useProviderConfigState } from '../config-provider/context'
import useFlexGapSupport from '../_util/hooks/flex-gap-support'
import useStyle from './style'
import Item from './item'
import Compact from './compact'

export type SpaceSize = SizeType | number

const spaceState = function ({ sizes, supportFlexGap, latestIndex }: any) {
  return {
    latestIndex: computed(() => latestIndex.value),
    horizontalSize: computed(() => sizes[0]),
    verticalSize: computed(() => sizes[1]),
    supportFlexGap: computed(() => supportFlexGap.value)
  }
}

export const [useSpaceProvider, useSpaceInject] =
  createInjectionState(spaceState)

export const useSpaceContextState = () =>
  useSpaceInject() ?? {
    latestIndex: computed(() => 0),
    horizontalSize: computed(() => 0),
    verticalSize: computed(() => 0),
    supportFlexGap: computed(() => false)
  }

export const spaceProps = {
  prefixCls: stringType(),
  rootClassName: stringType(),
  size: anyType<SizeType | [SpaceSize, SpaceSize]>('small'),
  direction: anyType<'horizontal' | 'vertical'>('horizontal'),
  align: stringType<'start' | 'end' | 'center' | 'baseline'>(),
  split: vNodeType(),
  wrap: booleanType(false)
}

const spaceSize = {
  small: 8,
  middle: 16,
  large: 24
}

function getNumberSize(size: SpaceSize) {
  return typeof size === 'string' ? spaceSize[size] : size || 0
}
const Space = defineComponent({
  name: 'ASpace',
  inheritAttrs: false,
  props: spaceProps,
  setup(props, { attrs, slots }) {
    const { getPrefixCls, direction: directionConfig } =
      useProviderConfigState()
    const supportFlexGap = useFlexGapSupport()
    const prefixCls = computed(() => getPrefixCls('space', props.prefixCls))
    const [wrapSSR, hashId] = useStyle(prefixCls)
    const sizes = computed<[SpaceSize, SpaceSize]>(() => {
      const { size } = props
      if (Array.isArray(size)) {
        return size.map(getNumberSize) as [SpaceSize, SpaceSize]
      }
      return [getNumberSize(size), getNumberSize(size)] as [
        SpaceSize,
        SpaceSize
      ]
    })
    const latestIndex = shallowRef(0)

    useSpaceProvider({ sizes, supportFlexGap, latestIndex })

    return () => {
      const { align, direction, rootClassName, split, wrap } = props
      const childNodes = filterEmpty(slots.default?.())
      const mergedAlign =
        align === undefined && direction === 'horizontal' ? 'center' : align
      const cn = classNames(
        prefixCls.value,
        hashId.value,
        `${prefixCls.value}-${direction}`,
        {
          [`${prefixCls.value}-rtl`]: directionConfig.value === 'rtl',
          [`${prefixCls.value}-align-${mergedAlign}`]: mergedAlign
        },
        attrs.class,
        rootClassName
      )
      const itemClassName = `${prefixCls.value}-item`
      const marginDirection =
        directionConfig.value === 'rtl' ? 'marginLeft' : 'marginRight'
      const nodes = childNodes.map((child, i) => {
        if (child !== null && child !== undefined) {
          latestIndex.value = i
        }
        const key =
          (isObject(child) && (child as any).key) || `${itemClassName}-${i}`
        return (
          <Item
            class={itemClassName}
            key={key}
            direction={direction}
            index={i}
            marginDirection={marginDirection}
            split={split}
            wrap={wrap}
          >
            {child}
          </Item>
        )
      })

      // =========================== Render ===========================
      if (childNodes.length === 0) {
        return null
      }
      const gapStyle: CSSProperties = {}
      if (wrap) {
        gapStyle.flexWrap = 'wrap'
        if (!supportFlexGap.value) {
          gapStyle.marginBottom = `-${sizes.value[1]}px`
        }
      }
      if (supportFlexGap.value) {
        gapStyle.columnGap = `${sizes.value[0]}px`
        gapStyle.rowGap = `${sizes.value[1]}px`
      }
      return wrapSSR(
        <div {...attrs} class={cn} style={[gapStyle, (attrs as any).style]}>
          {nodes}
        </div>
      )
    }
  }
})

Space.install = function (app: App) {
  app.component('ASpace', Space)
}

Space.Compact = Compact
export default Space as typeof Space &
  Plugin & {
    readonly Compact: typeof Compact
  }
