import { defineComponent } from 'vue'

const Wave = defineComponent({
  name: 'Wave',
  setup(_, { slots }) {
    return () => {
      return slots.default?.()
    }
  }
})

export default Wave
