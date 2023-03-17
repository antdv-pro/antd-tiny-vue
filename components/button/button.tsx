import { computed, defineComponent } from 'vue'
import { useProviderConfigState } from '../config-provider/context'
import useStyle from './style'
export default defineComponent({
  name: 'AButton',
  inheritAttrs: false,
  props: {
    prefixCls: {
      type: String
    }
  },
  setup(props, { slots }) {
    const { getPrefixCls } = useProviderConfigState()
    const prefixCls = computed(() => getPrefixCls('btn', props.prefixCls))
    const [wrapSSR, hashId] = useStyle(prefixCls)
    return () => {
      const cls = {
        [prefixCls.value]: true,
        [hashId.value]: true
      }
      return wrapSSR(<button class={cls}>{slots.default?.()}</button>)
    }
  }
})
