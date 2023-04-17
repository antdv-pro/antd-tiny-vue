import { useState } from '@v-c/utils'
import { onMounted } from 'vue'
import { detectFlexGapSupported } from '../style-checker'

export default () => {
  const [flexible, setFlexible] = useState(false)

  onMounted(() => {
    setFlexible(detectFlexGapSupported())
  })
  return flexible
}
