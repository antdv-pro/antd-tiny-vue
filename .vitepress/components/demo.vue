<script lang="ts" setup>
import { onMounted, shallowRef } from 'vue'

const comp = shallowRef()
onMounted(async () => {
  const { AntdTheme } = await import('vite-plugin-vitepress-demo/theme')
  comp.value = AntdTheme
})
</script>

<template>
  <ClientOnly>
    <component v-bind="$attrs" :is="comp"></component>
  </ClientOnly>
</template>

<style scoped></style>
