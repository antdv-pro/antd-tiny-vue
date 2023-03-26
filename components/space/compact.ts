import { classNames, createInjectionState } from '@v-c/utils'
import type { Ref } from 'vue'
import { computed } from 'vue'
import type { DirectionType } from '../config-provider'

const spaceCompactItem = () => {
  return {
    compactDirection: computed(() => null),
    isFirstItem: computed(() => null),
    isLastItem: computed(() => null),
    compactSize: computed(() => null)
  }
}

export const [useSpaceCompactProvider, useSpaceCompactInject] = createInjectionState(spaceCompactItem)

export const useSpaceCompactItemState = (): ReturnType<typeof spaceCompactItem> | undefined => useSpaceCompactInject()

export const useCompactItemContext = (prefixCls: Ref<string>, direction: Ref<DirectionType>) => {
  const compactItemContext = useSpaceCompactItemState()

  const compactItemClassnames = computed(() => {
    if (!compactItemContext) return ''

    const { compactDirection, isFirstItem, isLastItem } = compactItemContext
    const separator = compactDirection.value === 'vertical' ? '-vertical-' : '-'

    return classNames({
      [`${prefixCls.value}-compact${separator}item`]: true,
      [`${prefixCls.value}-compact${separator}first-item`]: isFirstItem.value,
      [`${prefixCls.value}-compact${separator}last-item`]: isLastItem.value,
      [`${prefixCls.value}-compact${separator}item-rtl`]: direction.value === 'rtl'
    })
  })

  return {
    compactSize: compactItemContext?.compactSize,
    compactDirection: compactItemContext?.compactDirection,
    compactItemClassnames
  }
}
