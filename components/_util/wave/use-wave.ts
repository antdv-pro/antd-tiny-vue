import type { ComputedRef, Ref } from 'vue'
import showWaveEffect from './wave-effect'

export default function useWave(nodeRef: Ref<HTMLElement>, className: ComputedRef<string>): VoidFunction {
  function showWave() {
    // const node = nodeRef.va!
    showWaveEffect(nodeRef, className)
  }

  return showWave
}
