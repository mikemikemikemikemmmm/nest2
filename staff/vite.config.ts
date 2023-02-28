import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vitejs.dev/config/
export default defineConfig(({ command, mode, ssrBuild }) => {
  if (command === 'build') {
    return {
      base: '/nest2/docs/staff/',
      plugins: [react()],
    }
  } else {
    return {
      plugins: [react()],
    }
  }
})