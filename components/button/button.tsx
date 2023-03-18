import { computed, defineComponent } from 'vue'
import { useProviderConfigState } from '../config-provider/context'
import Wave from '../_util/wave'
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

    const cls = computed(() => {
      return {
        [prefixCls.value]: true,
        [`${prefixCls.value}-${props.type}`]: !!props.type,
        [hashId.value]: true
      }
    })

    return () => {
      return wrapSSR(
        <Wave>
          <button
            {...attrs}
            class={[cls.value, attrs.class]}
          >
            {slots.default?.()}
          </button>
        </Wave>
      )
    }
  }
})

export default Button
