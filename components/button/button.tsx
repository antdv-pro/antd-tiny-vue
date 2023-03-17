import { computed, defineComponent } from 'vue'
import { useProviderConfigState } from '../config-provider/context'
import useStyle from './style'
const Button = defineComponent({
  name: 'AButton',
  inheritAttrs: false,
  props: {
    prefixCls: {
      type: String
    },
    type: {
      type: String,
      default: 'default'
    }
  },
  setup(props, { slots, attrs }) {
    const { getPrefixCls } = useProviderConfigState()
    const prefixCls = computed(() => getPrefixCls('btn', props.prefixCls))
    const [wrapSSR, hashId] = useStyle(prefixCls)
    return () => {
      const cls = {
        [prefixCls.value]: true,
        [`${prefixCls.value}-${props.type}`]: !!props.type,
        [hashId.value]: true
      }
      return wrapSSR(<button class={[cls, attrs.class]}>{slots.default?.()}</button>)
    }
  }
})

export default Button
