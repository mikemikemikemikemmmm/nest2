import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, ssrBuild }) => {
  if (command === 'build') {
    return {
      base: '/nest2/client/',
      plugins: [react({
        babel: {
          plugins: [
            ["react-remove-properties", { "properties": ["data-testid"] }]
          ]
        }
      })],
    }
  } else {
    return {
      plugins: [react()],
      test: {
        environment: 'happy-dom',
        coverage: {
          provider: 'c8',
          reporter: ['text', 'json', 'html'],
        },
      },
    }
  }
})