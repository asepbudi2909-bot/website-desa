import { json, type RequestHandler } from '@sveltejs/kit';
import { saveLocalMockR2 } from '$lib/server/storage';

/**
 * Image Upload API Route
 * POST /api/upload
 * 
 * Supports dual-mode image processing:
 * 1. Mode 'r2': Accepts binary file upload via multipart/form-data & stores in Cloudflare R2 bucket.
 * 2. Mode 'url': Accepts direct external HTTPS URL string.
 */
export const POST: RequestHandler = async ({ request, platform }) => {
	try {
		const contentType = request.headers.get('content-type') || '';

		// Handle Form Data (File Upload to R2 Bucket)
		if (contentType.includes('multipart/form-data')) {
			const formData = await request.formData();
			const file = formData.get('file') as File | null;

			if (!file || file.size === 0) {
				return json({ success: false, message: 'File gambar tidak valid atau kosong' }, { status: 400 });
			}

			// Validate file type
			if (!file.type.startsWith('image/')) {
				return json({ success: false, message: 'Format berkas harus berupa gambar (JPG, PNG, WebP, SVG)' }, { status: 400 });
			}

			// Limit file size to 10MB
			if (file.size > 10 * 1024 * 1024) {
				return json({ success: false, message: 'Ukuran gambar maksimal adalah 10MB' }, { status: 400 });
			}

			// Sanitize filename and create unique R2 key
			const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
			const key = `uploads/${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${sanitizedName}`;
			const arrayBuffer = await file.arrayBuffer();

			// 1. Store in Cloudflare R2 Bucket if binding is available
			if (platform?.env?.BUCKET) {
				await platform.env.BUCKET.put(key, arrayBuffer, {
					httpMetadata: {
						contentType: file.type
					}
				});

				const publicUrl = `/api/images/${key}`;
				return json({
					success: true,
					image_type: 'r2',
					image_url: publicUrl,
					key,
					message: 'Gambar berhasil diunggah ke Cloudflare R2!'
				});
			}

			// 2. Fallback store for local dev environment
			saveLocalMockR2(key, new Uint8Array(arrayBuffer), file.type);
			const localUrl = `/api/images/${key}`;

			return json({
				success: true,
				image_type: 'r2',
				image_url: localUrl,
				key,
				message: 'Gambar disimpan di local storage dev fallback (Siap untuk R2 saat deployed).'
			});
		}

		// Handle JSON (URL Option)
		const body = (await request.json()) as { imageUrl?: string };
		const { imageUrl } = body;

		if (!imageUrl || typeof imageUrl !== 'string') {
			return json({ success: false, message: 'URL gambar tidak valid' }, { status: 400 });
		}

		try {
			new URL(imageUrl);
		} catch {
			return json({ success: false, message: 'Format URL gambar tidak valid (harus diawali http:// atau https://)' }, { status: 400 });
		}

		return json({
			success: true,
			image_type: 'url',
			image_url: imageUrl,
			message: 'URL gambar eksternal berhasil disimpan!'
		});
	} catch (error: any) {
		console.error('Error uploading image:', error);
		return json({ success: false, message: error.message || 'Gagal memproses unggah gambar' }, { status: 500 });
	}
};
