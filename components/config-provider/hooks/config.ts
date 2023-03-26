import { useProviderConfigState } from '../context'

export const useConfig = () => {
  const { componentDisabled, componentSize } = useProviderConfigState()
  return {
    componentDisabled,
    componentSize
  }
}
