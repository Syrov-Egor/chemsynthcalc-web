import path from "path";
import tailwindcss from '@tailwindcss/vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, type Plugin } from 'vite';

// Content-Security-Policy for the deployed site. It is injected only into the
// production index.html (see cspPlugin) because Vite's dev server relies on
// inline styles for HMR. 'wasm-unsafe-eval' allows WebAssembly compilation
// without allowing JavaScript eval; the TinyGo glue is imported as a module.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'wasm-unsafe-eval'",
  "worker-src 'self'",
  "connect-src 'self'",
  "img-src 'self' data:",
  "font-src 'self'",
  "style-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
].join('; ');

const cspPlugin: Plugin = {
  name: 'inject-csp',
  apply: 'build',
  transformIndexHtml: () => [
    {
      tag: 'meta',
      attrs: { 'http-equiv': 'Content-Security-Policy', content: contentSecurityPolicy },
      injectTo: 'head-prepend',
    },
  ],
};

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => ({
  base: command === "build" || isPreview ? "/chemsynthcalc-web/" : "/",
  plugins: [tailwindcss(), svelte(), cspPlugin, visualizer({ open: true })],
  server: { host: '127.0.0.1', port: 5173 },
  resolve: {
    alias: {
      $lib: path.resolve("./src/lib"),
    },
  },
}));
