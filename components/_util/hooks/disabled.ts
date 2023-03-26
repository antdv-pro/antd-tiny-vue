import type { ComputedRef } from 'vue'
import { computed } from 'vue'
import { useProviderConfigState } from '../../config-provider/context'

export const useDisabled = (props: Record<string, any>) => {
  const { componentDisabled } = useProviderConfigState()
  return computed(() => props.disabled || componentDisabled.value) as ComputedRef<boolean>
}
