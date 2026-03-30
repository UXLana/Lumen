import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    components: 'components/index.ts',
    'styles/design-tokens': 'styles/design-tokens.ts',
    'styles/themes': 'styles/themes/index.ts',
    'hooks/index': 'hooks/index.ts',
  },
  outDir: 'dist',
  format: ['esm', 'cjs'],
  dts: {
    compilerOptions: {
      incremental: false,
    },
  },
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react-dom'],
  esbuildOptions(options) {
    options.jsx = 'automatic'
  },
})
