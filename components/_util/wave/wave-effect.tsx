import type { ComputedRef, Ref } from 'vue'
import { unrefElement, useResizeObserver } from '@vueuse/core'
import { computed, defineComponent, onMounted, render, shallowRef, toRef } from 'vue'
import { classNames, delayTimer, objectType, safeNextick, useState } from '@v-c/utils'
import { getTargetWaveColor } from './util'
function validateNum(value: number) {
  return Number.isNaN(value) ? 0 : value
}
export const WaveEffect = defineComponent({
  name: 'WaveEffect',
  props: {
    target: objectType<HTMLElement>()
  },
  setup(props, { attrs }) {
    const divRef = shallowRef<HTMLDivElement | undefined>(undefined)

    const [color, setWaveColor] = useState<string | null>(null)
    const [borderRadius, setBorderRadius] = useState<number[]>([])
    const [left, setLeft] = useState(0)
    const [top, setTop] = useState(0)
    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)
    const [enabled, setEnabled] = useState(false)
    const [active, setActive] = useState(false)
    const waveStyle = computed(() => {
      const style: Record<string, any> = {
        left: `${left.value}px`,
        top: `${top.value}px`,
        width: `${width.value}px`,
        height: `${height.value}px`,
        borderRadius: borderRadius.value.map(radius => `${radius}px`).join(' ')
      }
      if (color.value) {
        style['--wave-color'] = color.value
      }
      return style
    })
    function syncPos() {
      const { target } = props
      const nodeStyle = getComputedStyle(target)

      // Get wave color from target
      setWaveColor(getTargetWaveColor(target))

      const isStatic = nodeStyle.position === 'static'

      // Rect
      const { borderLeftWidth, borderTopWidth } = nodeStyle
      setLeft(isStatic ? target.offsetLeft : validateNum(-parseFloat(borderLeftWidth)))
      setTop(isStatic ? target.offsetTop : validateNum(-parseFloat(borderTopWidth)))
      setWidth(target.offsetWidth)
      setHeight(target.offsetHeight)

      // Get border radius
      const { borderTopLeftRadius, borderTopRightRadius, borderBottomLeftRadius, borderBottomRightRadius } = nodeStyle

      setBorderRadius([borderTopLeftRadius, borderTopRightRadius, borderBottomRightRadius, borderBottomLeftRadius].map(radius => validateNum(parseFloat(radius))))
    }
    onMounted(async () => {
      syncPos()
      setEnabled(true)
      await safeNextick()
      setActive(true)
      await delayTimer(5000)
      const holder = divRef.value?.parentElement
      holder!.parentElement?.removeChild(holder!)
    })
    const motionClassName = computed(() =>
      classNames({
        'wave-motion-appear': enabled.value,
        'wave-motion': true
      })
    )
    const motionClassNameActive = computed(() => ({
      'wave-motion-appear-active': active.value
    }))
    useResizeObserver(toRef(props, 'target'), syncPos)

    return () => {
      if (!enabled.value) return null
      return (
        <div
          ref={divRef}
          class={[attrs.class, motionClassName.value, motionClassNameActive.value]}
          style={waveStyle.value}
        />
      )
    }
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
