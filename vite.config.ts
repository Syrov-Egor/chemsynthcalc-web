import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	// Enable Web Worker support
	worker: {
		format: 'es', // Use ES modules in workers
		plugins: () => [sveltekit()]
	},
	// Optimize for WASM
	optimizeDeps: {
		exclude: ['$lib/main.wasm', '$lib/wasm_exec_tiny']
	},
	// Ensure proper MIME types
	server: {
		fs: { strict: false },
		headers: {
			'Cross-Origin-Opener-Policy': 'same-origin',
			'Cross-Origin-Embedder-Policy': 'require-corp'
		}
	},
	build: {
		// Target modern browsers that support Workers
		target: 'esnext',
		// Keep worker files separate
		rollupOptions: {
			output: { // Ensure workers are properly chunked
				manualChunks: undefined
			}
		}
	}
});
