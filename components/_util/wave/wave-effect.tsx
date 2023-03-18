import type { ComputedRef, Ref } from 'vue'
import { unrefElement } from '@vueuse/core'
import { defineComponent, render } from 'vue'
import { objectType } from '@v-c/utils'

export const WaveEffect = defineComponent({
  name: 'WaveEffect',
  props: {
    target: objectType<HTMLElement>()
  },
  setup() {
    return () => null
  }
})

export default function showWaveEffect(nodeRef: Ref<HTMLElement>, className: ComputedRef<string>) {
  const node = unrefElement(nodeRef)
  // Create holder
  const holder = document.createElement('div')
  holder.style.position = 'absolute'
  holder.style.left = `0px`
  holder.style.top = `0px`
  node?.insertBefore(holder, node?.firstChild)

  render(
    <WaveEffect
      target={node}
      class={className.value}
    />,
    holder
  )
}
