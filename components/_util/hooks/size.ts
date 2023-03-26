import type { ComputedRef } from 'vue'
import { computed } from 'vue'
import type { SizeType } from '../../config-provider/context'
import { useProviderConfigState } from '../../config-provider/context'

export const useSize = (props: Record<string, any>) => {
  const { componentSize } = useProviderConfigState()
  return computed(() => props.size || componentSize.value) as ComputedRef<SizeType>
}
