import { Transition, defineComponent, nextTick } from 'vue'
import { booleanType, someType, stringType } from '@v-c/utils'
import LoadingOutlined from '@ant-design/icons-vue/LoadingOutlined'

export interface LoadingIconProps {
  prefixCls: string
  existIcon: boolean
  loading?: boolean | object
}
export const loadingIconProps = {
  prefixCls: stringType(),
  existIcon: booleanType(),
  loading: someType<boolean | object>([Boolean, Object])
}

const getCollapsedWidth = (el: Element) => {
  const node: HTMLElement = el as HTMLElement
  if (node) {
    node.style.width = '0'
    node.style.opacity = '0'
    node.style.transform = 'scale(0)'
  }
}

const getRealWidth = (el: Element) => {
  const node: HTMLElement = el as HTMLElement
  nextTick(() => {
    if (node) {
      node.style.width = `${node.scrollWidth}px`
      node.style.opacity = '1'
      node.style.transform = 'scale(1)'
    }
  }).then()
}

const LoadingIcon = defineComponent({
  name: 'LoadingIcon',
  props: loadingIconProps,
  setup(props) {
    return () => {
      const { loading, existIcon, prefixCls } = props
      const visible = !!loading
      if (existIcon) {
        return (
          <span class={`${prefixCls}-loading-icon`}>
            <LoadingOutlined />
          </span>
        )
      }
      return (
        <Transition
          name={`${prefixCls}-loading-icon-motion`}
          onBeforeEnter={getCollapsedWidth}
          onEnter={getRealWidth}
        >
          {visible ? (
            <span class={`${prefixCls}-loading-icon`}>
              <LoadingOutlined />
            </span>
          ) : null}
        </Transition>
      )
    }
  }
})

export default LoadingIcon
