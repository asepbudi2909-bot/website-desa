import type { RequestHandler } from '@sveltejs/kit';
import { getLocalMockR2 } from '$lib/server/storage';

/**
 * Cloudflare R2 Object Delivery Endpoint
 * GET /api/images/<key>
 * 
 * Fetches the requested binary file directly from the Cloudflare R2 Bucket binding (`env.BUCKET`)
 * and streams it with high-performance edge caching headers.
 */

export const GET: RequestHandler = async ({ params, platform }) => {
	const key = params.key;

	if (!key) {
		return new Response('Image key is required', { status: 400 });
	}

	// 1. If Cloudflare R2 binding is active, fetch from R2
	if (platform?.env?.BUCKET) {
		const object = await platform.env.BUCKET.get(key);

		if (!object) {
			return new Response('Gambar tidak ditemukan di Cloudflare R2', { status: 404 });
		}

		const headers = new Headers();
		object.writeHttpMetadata(headers);
		headers.set('etag', object.httpEtag);
		// Edge caching for maximum Cloudflare Pages performance
		headers.set('Cache-Control', 'public, max-age=31536000, immutable');

		return new Response(object.body as ReadableStream, {
			headers
		});
	}

	// 2. Local fallback for Vite dev preview
	const localItem = getLocalMockR2(key);
	if (localItem) {
		return new Response(localItem.body.buffer as ArrayBuffer, {
			headers: {
				'Content-Type': localItem.contentType,
				'Cache-Control': 'public, max-age=86400'
			}
		});
	}

	return new Response('Image not found in storage', { status: 404 });
};
