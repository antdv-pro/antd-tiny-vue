import {
  anyType,
  booleanType,
  classNames,
  createInjectionState,
  filterEmpty,
  isObject,
  stringType
} from '@v-c/utils'
import type { Ref } from 'vue'
import { computed, defineComponent } from 'vue'
import type { DirectionType } from '../config-provider'
import type { SizeType } from '../config-provider/context'
import { useProviderConfigState } from '../config-provider/context'
import useStyle from './style'

const spaceCompactItem = (props: any) => {
  return {
    compactDirection: computed(() => props.compactDirection),
    isFirstItem: computed(() => props.isFirstItem),
    isLastItem: computed(() => props.isLastItem),
    compactSize: computed(() => props.compactSize)
  }
}

export const [useSpaceCompactProvider, useSpaceCompactInject] =
  createInjectionState(spaceCompactItem)

export const useSpaceCompactItemState = ():
  | ReturnType<typeof spaceCompactItem>
  | undefined => useSpaceCompactInject()

export const useCompactItemContext = (
  prefixCls: Ref<string>,
  direction: Ref<DirectionType>
) => {
  const compactItemContext = useSpaceCompactItemState()

  const compactItemClassnames = computed(() => {
    if (!compactItemContext) return ''

    const { compactDirection, isFirstItem, isLastItem } = compactItemContext
    const separator = compactDirection.value === 'vertical' ? '-vertical-' : '-'

    return classNames({
      [`${prefixCls.value}-compact${separator}item`]: true,
      [`${prefixCls.value}-compact${separator}first-item`]: isFirstItem.value,
      [`${prefixCls.value}-compact${separator}last-item`]: isLastItem.value,
      [`${prefixCls.value}-compact${separator}item-rtl`]:
        direction.value === 'rtl'
    })
  })

  return {
    compactSize: compactItemContext?.compactSize,
    compactDirection: compactItemContext?.compactDirection,
    compactItemClassnames
  }
}

const CompactItem = defineComponent({
  name: 'CompactItem',
  inheritAttrs: false,
  props: {
    compactSize: anyType<SizeType>(),
    compactDirection: stringType<'horizontal' | 'vertical'>(),
    isFirstItem: booleanType(),
    isLastItem: booleanType()
  },
  setup(props, { slots }) {
    useSpaceCompactProvider(props)
    return () => slots.default?.()
  }
})

export const spaceCompactProps = {
  prefixCls: stringType(),
  size: anyType<SizeType>('middle'),
  direction: stringType<'horizontal' | 'vertical'>(),
  block: anyType<boolean>(),
  rootClassName: stringType()
}

const Compact = defineComponent({
  name: 'Compact',
  inheritAttrs: false,
  props: spaceCompactProps,
  setup(props, { slots, attrs }) {
    const { getPrefixCls, direction: directionConfig } =
      useProviderConfigState()
    const prefixCls = computed(() =>
      getPrefixCls('space-compact', props.prefixCls)
    )
    const [wrapSSR, hashId] = useStyle(prefixCls)
    const compactItemContext = useSpaceCompactItemState()
    return () => {
      const childNodes = filterEmpty(slots.default?.())
      if (childNodes.length === 0) return null
      const { rootClassName, size, direction } = props
      const cls = classNames(
        prefixCls.value,
        hashId.value,
        {
          [`${prefixCls.value}-rtl`]: directionConfig.value === 'rtl',
          [`${prefixCls.value}-block`]: props.block,
          [`${prefixCls.value}-vertical`]: props.direction === 'vertical'
        },
        attrs.class,
        rootClassName
      )
      const nodes = childNodes.map((child, index) => {
        const key =
          (isObject(child) && (child as any).key) ||
          `${prefixCls.value}-item-${index}`
        return (
          <CompactItem
            key={key}
            compactSize={size}
            compactDirection={direction}
            isFirstItem={
              (index === 0 && !compactItemContext) ||
              compactItemContext?.isFirstItem.value
            }
            isLastItem={
              index === childNodes.length - 1 &&
              (!compactItemContext || compactItemContext?.isLastItem.value)
            }
          >
            {child}
          </CompactItem>
        )
      })
      return wrapSSR(
        <div {...attrs} class={cls}>
          {nodes}
        </div>
      )
    }
  }
})

export default Compact
