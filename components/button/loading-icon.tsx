import { defineComponent } from 'vue'
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

// const getCollapsedWidth = (): CSSProperties => ({
//   width: 0,
//   opacity: 0,
//   transform: 'scale(0)'
// })
//
// const getRealWidth = (node: HTMLElement): CSSProperties => ({
//   width: node.scrollWidth,
//   opacity: 1,
//   transform: 'scale(1)'
// })

const LoadingIcon = defineComponent({
  name: 'LoadingIcon',
  props: loadingIconProps,
  setup(props) {
    return () => {
      const { existIcon, prefixCls } = props
      // const visible = !!loading
      if (existIcon) {
        return (
          <span class={`${prefixCls}-loading-icon`}>
            <LoadingOutlined />
          </span>
        )
      }
    }
  }
})

export default LoadingIcon
