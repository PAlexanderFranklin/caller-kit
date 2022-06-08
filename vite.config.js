import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: "es2020"
  },
  plugins: [svelte()],
	optimizeDeps: { exclude: ["svelte-navigator"] },
})
