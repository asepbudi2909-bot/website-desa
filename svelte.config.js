import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// Vercel menetapkan env VERCEL saat build; di luar itu proyek tetap memakai Cloudflare.
const isVercel = !!process.env.VERCEL;

const adapter = isVercel
	? (await import('@sveltejs/adapter-vercel')).default({ runtime: 'nodejs22.x' })
	: (await import('@sveltejs/adapter-cloudflare')).default({
			routes: {
				include: ['/*'],
				exclude: ['<all>']
			}
		});

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter
	}
};

export default config;
