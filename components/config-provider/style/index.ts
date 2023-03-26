import { useStyleRegister } from '@antd-tiny-vue/cssinjs'
import type { Ref } from 'vue'
import { computed } from 'vue'
import { resetIcon } from '../../style'
import { useToken } from '../../theme/internal'

const useStyle = (iconPrefixCls: Ref<string>) => {
  const [theme, token] = useToken()
  // Generate style for icons
  const info = computed(() => ({ theme: theme.value, token: token.value, hashId: '', path: ['ant-design-icons', iconPrefixCls.value] }))
  return useStyleRegister(info, () => [
    {
      [`.${iconPrefixCls.value}`]: {
        ...resetIcon(),
        [`.${iconPrefixCls.value} .${iconPrefixCls.value}-icon`]: {
          display: 'block'
        }
      }
    }
  ])
}

export default useStyle
