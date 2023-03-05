import { computed, defineComponent } from 'vue'
import type { CSSInterpolation } from '@antd-tiny-vue/cssinjs'
import { useStyleRegister } from '@antd-tiny-vue/cssinjs'
import type { ThemeToken } from '../theme'
import { useToken } from '../theme'

export const generateButtonStyle = (prefixCls: string, token: ThemeToken): CSSInterpolation => ({
  [`.${prefixCls}`]: {
    backgroundColor: token.primaryColor,
    padding: '10px 20px',
    '&:hover': {
      backgroundColor: 'red'
    }
  }
})

const Button = defineComponent({
  name: 'AButton',
  setup() {
    const prefixCls = 'ant-btn'
    const [theme, token, hashId] = useToken()
    const info = computed<any>(() => ({
      theme: theme.value,
      token: token.value,
      path: [prefixCls],
      hashId: hashId.value
    }))
    const wrapSSR = useStyleRegister(info, () => [generateButtonStyle(prefixCls, token.value as any)])
    return () => wrapSSR(<button class={[prefixCls, hashId.value]}>按钮</button>)
  }
})

export default Button
