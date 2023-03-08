import { defineComponent } from 'vue'
export default defineComponent({
  name: 'AButton',
  setup(props, { slots }) {
    return () => {
      return <button>{slots.default?.()}</button>
    }
  }
})
