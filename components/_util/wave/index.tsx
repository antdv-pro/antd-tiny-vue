import type { VNode } from 'vue'
import { cloneVNode, computed, defineComponent, shallowRef } from 'vue'
import { booleanType, classNames, filterEmpty, isVisible } from '@v-c/utils'
import { useEventListener } from '@vueuse/core'
import { useProviderConfigState } from '../../config-provider/context'
import useStyle from './style'
import useWave from './use-wave'

const Wave = defineComponent({
  name: 'Wave',
  props: {
    disabled: booleanType()
  },
  setup(props, { slots }) {
    const { getPrefixCls } = useProviderConfigState()
    const containerRef = shallowRef()

    // ============================== Style ===============================
    const prefixCls = computed(() => getPrefixCls('wave'))
    const [, hashId] = useStyle(prefixCls)
    const showWave = useWave(
      containerRef,
      computed(() => classNames(prefixCls.value, hashId.value))
    )

    const onClick = (e: MouseEvent) => {
      const node = containerRef.value
      const { disabled } = props
      if (!node || node.nodeType !== 1 || disabled) {
        return
      }
      // Fix radio button click twice
      if (
        (e.target as HTMLElement).tagName === 'INPUT' ||
        !isVisible(e.target as HTMLElement) ||
        // No need wave
        !node.getAttribute ||
        node.getAttribute('disabled') ||
        (node as HTMLInputElement).disabled ||
        node.className.includes('disabled') ||
        node.className.includes('-leave')
      ) {
        return
      }

      showWave()
    }

    useEventListener(containerRef, 'click', onClick, true)

    return () => {
      const children = slots.default?.()
      const child = filterEmpty(children)[0]
      if (!child) return null
      return cloneVNode(child as VNode, { ref: containerRef })
    }
  }
})

export default Wave
