import path from "path";
import tailwindcss from '@tailwindcss/vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), svelte()],
  server: { host: '127.0.0.1', port: 5173 },
  resolve: {
    alias: {
      $lib: path.resolve("./src/lib"),
    },
  },
});
