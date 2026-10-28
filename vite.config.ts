import path from "path";
import tailwindcss from '@tailwindcss/vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), svelte(), visualizer({ open: true })],
  server: { host: '127.0.0.1', port: 5173 },
  resolve: {
    alias: {
      $lib: path.resolve("./src/lib"),
    },
  },
});
