import { computed, defineComponent, onMounted, shallowRef } from 'vue'
import { tryOnBeforeUnmount } from '@vueuse/core'
import {
  classNames,
  filterEmpty,
  getSlotsProps,
  runEvent,
  useState
} from '@v-c/utils'
import { useProviderConfigState } from '../config-provider/context'
import warning from '../_util/warning'
import Wave from '../_util/wave'
import { useSize } from '../_util/hooks/size'
import { useDisabled } from '../_util/hooks/disabled'
import { useCompactItemContext } from '../space/compact'
import useStyle from './style'
import type { ButtonProps, LoadingConfigType } from './interface'
import { buttonProps } from './interface'
import {
  isTwoCNChar,
  isUnBorderedButtonType,
  spaceChildren
} from './button-helper'
import LoadingIcon from './loading-icon'
type Loading = number | boolean

function getLoadingConfig(loading: ButtonProps['loading']): LoadingConfigType {
  if (typeof loading === 'object' && loading) {
    const delay = loading?.delay
    const isDelay = !Number.isNaN(delay) && typeof delay === 'number'
    return {
      loading: false,
      delay: isDelay ? delay : 0
    }
  }

  return {
    loading,
    delay: 0
  }
}

const Button = defineComponent({
  name: 'AButton',
  inheritAttrs: false,
  __ANT_BUTTON: true,
  props: {
    ...buttonProps
  },
  setup(props, { slots, attrs }) {
    const { getPrefixCls, autoInsertSpaceInButton, direction } =
      useProviderConfigState()
    const prefixCls = computed(() => getPrefixCls('btn', props.prefixCls))
    const [wrapSSR, hashId] = useStyle(prefixCls)
    const size = useSize(props)
    const { compactSize, compactItemClassnames } = useCompactItemContext(
      prefixCls,
      direction
    )
    const sizeCls = computed(() => {
      const sizeClassNameMap: Record<string, any> = {
        large: 'lg',
        small: 'sm',
        middle: undefined
      }
      const sizeFullName = compactSize?.value || size.value
      return sizeClassNameMap[sizeFullName]
    })
    const disabled = useDisabled(props)
    const buttonRef = shallowRef<HTMLButtonElement | null>(null)

    const loadingOrDelay = computed(() => {
      return getLoadingConfig(props.loading)
    })

    const [innerLoading, setLoading] = useState<Loading>(
      loadingOrDelay.value.loading
    )
    const [hasTwoCNChar, setHasTwoCNChar] = useState(false)

    let isNeedInserted = false

    const fixTwoCNChar = () => {
      // FIXME: for HOC usage like <FormatMessage />
      if (!buttonRef.value || autoInsertSpaceInButton.value === false) {
        return
      }
      const buttonText = buttonRef.value.textContent
      if (isNeedInserted && isTwoCNChar(buttonText as string)) {
        if (!hasTwoCNChar.value) {
          setHasTwoCNChar(true)
        }
      } else if (hasTwoCNChar.value) {
        setHasTwoCNChar(false)
      }
    }

    let delayTimer: number | null = null

    onMounted(() => {
      if (loadingOrDelay.value.delay > 0) {
        delayTimer = window.setTimeout(() => {
          delayTimer = null
          setLoading(true)
        }, loadingOrDelay.value.delay)
      } else {
        setLoading(loadingOrDelay.value.loading)
      }
    })

    function cleanupTimer() {
      if (delayTimer) {
        window.clearTimeout(delayTimer)
        delayTimer = null
      }
    }
    tryOnBeforeUnmount(() => {
      cleanupTimer()
    })

    const handleClick = (e: MouseEvent) => {
      // FIXME: https://github.com/ant-design/ant-design/issues/30207
      if (innerLoading.value || disabled.value) {
        e.preventDefault()
        return
      }
      runEvent(props, 'onClick', e)
    }

    const showError = () => {
      const { ghost, type } = props

      const icon = getSlotsProps(slots, props, 'icon')

      warning(
        !(typeof icon === 'string' && icon.length > 2),
        'Button',
        `\`icon\` is using ReactNode instead of string naming in v4. Please check \`${icon}\` at https://ant.design/components/icon`
      )

      warning(
        !(ghost && isUnBorderedButtonType(type)),
        'Button',
        "`link` or `text` button can't be a `ghost` button."
      )
    }

    return () => {
      const { shape, rootClassName, ghost, type, block, danger } = props
      const icon = getSlotsProps(slots, props, 'icon')
      const children = filterEmpty(slots.default?.())
      isNeedInserted =
        children.length === 1 &&
        !slots.icon &&
        !isUnBorderedButtonType(props.type)
      fixTwoCNChar()
      showError()
      const iconType = innerLoading.value ? 'loading' : icon

      const autoInsertSpace = autoInsertSpaceInButton.value !== false

      const hrefAndDisabled = attrs.href !== undefined && disabled.value

      const classes = classNames(
        prefixCls.value,
        hashId.value,
        {
          [`${prefixCls.value}-${shape}`]: shape !== 'default' && shape,
          [`${prefixCls.value}-${type}`]: type,
          [`${prefixCls.value}-${sizeCls.value}`]: sizeCls.value,
          [`${prefixCls.value}-icon-only`]:
            !children && children !== 0 && !!iconType,
          [`${prefixCls.value}-background-ghost`]:
            ghost && !isUnBorderedButtonType(type),
          [`${prefixCls.value}-loading`]: innerLoading.value,
          [`${prefixCls.value}-two-chinese-chars`]:
            hasTwoCNChar.value && autoInsertSpace && !innerLoading.value,
          [`${prefixCls.value}-block`]: block,
          [`${prefixCls.value}-dangerous`]: !!danger,
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
          [`${prefixCls.value}-disabled`]: hrefAndDisabled
        },
        attrs.class,
        compactItemClassnames.value,
        rootClassName
      )
      const iconNode =
        icon &&
        (!innerLoading.value ? (
          icon?.()
        ) : (
          <LoadingIcon
            existIcon={!!icon}
            prefixCls={prefixCls.value}
            loading={!!innerLoading.value}
          />
        ))

      const kids =
        children || children === 0
          ? spaceChildren(children[0] as any, isNeedInserted && autoInsertSpace)
          : undefined
      if (attrs.href !== undefined) {
        return wrapSSR(
          <a
            {...attrs}
            {...props}
            class={classes}
            onClick={handleClick}
            ref={buttonRef}
          >
            {iconNode}
            {kids}
          </a>
        )
      }
      let buttonNode = (
        <button
          {...attrs}
          onClick={handleClick}
          class={classes}
          ref={buttonRef}
        >
          {iconNode}
          {kids}
        </button>
      )

      if (!isUnBorderedButtonType(type)) {
        buttonNode = <Wave>{buttonNode}</Wave>
      }

      return wrapSSR(buttonNode)
    }
  }
})

export default Button
