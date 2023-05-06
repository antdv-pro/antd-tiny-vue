import { defineConfig } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'
export default defineConfig({
  plugins: [
    vueJsx(),
    dts({
      outputDir: ['es', 'lib'],
      include: ['components/**/*.ts', 'components/**/*.tsx']
    })
  ],
  build: {
    minify: false,
    rollupOptions: {
      external: [
        '@ant-design/colors',
        /^@ant-design\/icons-vue/,
        '@antd-tiny-vue/cssinjs',
        '@ctrl/tinycolor',
        '@v-c/utils',
        '@vueuse/core',
        'vue'
      ],
      output: [
        {
          format: 'es',
          dir: 'es',
          entryFileNames: '[name].js',
          preserveModules: true,
          preserveModulesRoot: 'components'
        },
        {
          format: 'cjs',
          dir: 'lib',
          entryFileNames: '[name].js',
          preserveModules: true,
          preserveModulesRoot: 'components',
          exports: 'named'
        }
      ]
    },
    lib: {
      entry: 'components/index.ts',
      formats: ['es', 'cjs']
    }
  }
})
